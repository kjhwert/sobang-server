import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../module/entities/user/user.entity';
import { Brackets, getManager, Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import {
  pagination,
  PER_PAGE,
  responseCreated,
  responseDestroyed,
  responseNotAcceptable,
  responseOk,
  responseUpdated,
  SKIP_PAGE,
} from '../module/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailValidationLogService } from '../email/validation-log/email-validation-log.service';
import emailValidationForm from '../module/emailForm/emailValidationForm';
import {
  advisoryUserExcelUploadDto,
  changePasswordUserDto,
  createAdminUserDto,
  createUserDto,
  findUserEmailDto,
  indexUserDto,
} from '../module/DTOs/user.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as bcrypt from 'bcrypt';
import findUserPasswordForm from '../module/emailForm/findUserPasswordForm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly emailValidationLogService: EmailValidationLogService,
  ) {}

  async index({ type, name, page }: indexUserDto) {
    const total = await this.getIndexCount(type, name);
    const paging = await pagination(page, total);

    const data = await this.userRepository
      .createQueryBuilder()
      .select([
        'id',
        'email',
        'name',
        'businessName',
        'businessOwner',
        'businessNo',
        'department',
        'position',
        'createdAt',
        'updatedAt',
      ])
      .where('status = :act')
      .andWhere('typeId = :type')
      .andWhere(
        new Brackets(qb =>
          qb.orWhere('name like :name').orWhere('businessName like :name'),
        ),
      )
      .setParameters({ type, name: `%${name}%`, act: Code.ACT })
      .orderBy('id', 'DESC')
      .offset(SKIP_PAGE(page))
      .limit(PER_PAGE)
      .getRawMany();

    return responseOk(data, paging);
  }

  getIndexCount(type: number, name: string) {
    return this.userRepository
      .createQueryBuilder()
      .where('status = :act')
      .andWhere('typeId = :type')
      .andWhere(
        new Brackets(qb =>
          qb.orWhere('name like :name').orWhere('businessName like :name'),
        ),
      )
      .setParameters({ type, name: `%${name}%`, act: Code.ACT })
      .getCount();
  }

  async show(userId: number) {
    const { password, ...data } = await this.findById(userId);
    // const data = await this.userRepository
    //   .createQueryBuilder()
    //   .select([
    //     'email',
    //     'name',
    //     'businessName',
    //     'businessOwner',
    //     'businessNo',
    //     'position',
    //     'department',
    //   ])
    //   .where('id = :userId', { userId })
    //   .getOne();

    return responseOk(data);
  }

  async getAllUsersByType(type: number) {
    return await this.userRepository
      .createQueryBuilder()
      .where('typeId = :type')
      .andWhere('status = :act')
      .setParameters({ type, act: Code.ACT })
      .getMany();
  }

  async searchAdvisory(name: string) {
    const data = await this.userRepository
      .createQueryBuilder()
      .select(['id', 'name', 'email'])
      .where('status = :act')
      .andWhere('typeId = :type')
      .andWhere('name like :name')
      .setParameters({ act: Code.ACT, type: Code.ADVISORY, name: `%${name}%` })
      .getRawMany();

    return responseOk(data);
  }

  async createAdmin(adminId: number, data: createAdminUserDto) {
    const hasEmail = await this.hasEmail(data.email);
    if (hasEmail) {
      return responseNotAcceptable('이미 가입 중인 이메일입니다.');
    }

    try {
      const newUser = await this.userRepository.create({
        ...data,
        type: Code.ADMIN,
        createdId: adminId,
      });
      await this.userRepository.save(newUser);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async advisoryUserExcelUpload(data: Array<advisoryUserExcelUploadDto>) {
    await Promise.all(
      data.map(async ({ email }) => {
        const user = await this.findByEmail(email);
        if (user) {
          throw new NotAcceptableException(
            '',
            `${email}은(는) 이미 가입된 이메일입니다.`,
          );
        }
      }),
    );

    await getManager().transaction(async manager => {
      try {
        await Promise.all(
          data.map(async advisory => {
            const newUser = await this.userRepository.create({
              ...advisory,
              password: randomStringGenerator(),
              type: Code.ADVISORY,
            });
            await manager.save(newUser);
          }),
        );
      } catch (e) {
        throw new NotAcceptableException('', e.message);
      }
    });

    return responseCreated();
  }

  async create(data: createUserDto) {
    const { email, code, type } = data;

    const isValidated = await this.emailValidationLogService.isValidated(
      email,
      code,
    );
    if (!isValidated) {
      return responseNotAcceptable('인증코드가 일치하지 않습니다.');
    }

    const isEmailForm = await this.isEmailForm(email);
    if (!isEmailForm) {
      return responseNotAcceptable('올바른 이메일 형식이 아닙니다.');
    }

    if (type === Code.ADVISORY) {
      return await this.createAdvisoryUser(data);
    }

    const hasEmail = await this.hasEmail(email);
    if (hasEmail) {
      return responseNotAcceptable('이미 가입 중인 이메일입니다.');
    }

    if (type === Code.ORGANIZATION) {
      return await this.createOrganizationUser(data);
    }
  }

  async destroy(adminId: number, userId: number) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update({ status: Code.DELETE, updatedId: adminId })
        .where('id = :userId', { userId })
        .execute();

      return responseDestroyed();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async findUserPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return responseNotAcceptable('일치하는 이메일 정보가 없습니다.');
    }

    try {
      const tempPassword = randomStringGenerator().substr(0, 8);
      const password = await bcrypt.hash(tempPassword, 10);

      await this.mailerService.sendMail({
        to: email,
        from: 'contact@hlabtech.com',
        subject: '[국립소방연구원] 임시 비밀번호 제공 안내입니다.',
        html: findUserPasswordForm(email, tempPassword),
      });

      await this.userRepository
        .createQueryBuilder()
        .update({ password })
        .where('id = :id', { id: user.id })
        .execute();

      return responseOk({}, {}, '이메일로 임시 비밀번호를 보내드렸습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async findUserEmail({
    name,
    businessNo,
    businessOwner,
    type,
  }: findUserEmailDto) {
    if (Number(type) === Code.ORGANIZATION) {
      const user = await this.userRepository
        .createQueryBuilder()
        .where('typeId = :type')
        .andWhere('status = :act')
        .andWhere('businessOwner = :businessOwner')
        .andWhere('businessNo = :businessNo')
        .setParameters({ type, businessOwner, businessNo, act: Code.ACT })
        .getOne();

      if (!user) {
        return responseNotAcceptable('일치하는 이메일 정보가 없습니다.');
      }

      return responseOk({ id: user.id, email: user.email });
    }

    const user = await this.userRepository
      .createQueryBuilder()
      .where('typeId = :type')
      .andWhere('status = :act')
      .andWhere('name = :name')
      .setParameters({ type, name, act: Code.ACT })
      .getOne();

    if (!user) {
      return responseNotAcceptable('일치하는 이메일 정보가 없습니다.');
    }

    return responseOk({ id: user.id, email: user.email });
  }

  async createOrganizationUser(data: createUserDto) {
    const type = Code.ORGANIZATION;
    return await this.createUser(type, data);
  }

  async createAdvisoryUser({ email, password: newPassword }: createUserDto) {
    const user = await this.findByEmail(email);
    if (!user) {
      return responseNotAcceptable('등록된 자문단 정보가 없습니다.');
    }

    if (user.updatedAt) {
      return responseNotAcceptable('이미 가입되었습니다.');
    }

    try {
      const password = await user.changePassword(newPassword);

      await this.userRepository
        .createQueryBuilder()
        .update({ password })
        .where('email = :email', { email })
        .execute();

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async createUser(type: number, data: createUserDto) {
    try {
      const newUser = await this.userRepository.create({ ...data, type });
      await this.userRepository.save(newUser);

      return responseCreated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async changePassword(
    userId: number,
    { oldPassword, newPassword }: changePasswordUserDto,
  ) {
    const user = await this.findById(userId);

    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
      return responseNotAcceptable('비밀번호가 일치하지 않습니다.');
    }

    const password = await user.changePassword(newPassword);

    try {
      await this.userRepository
        .createQueryBuilder()
        .update({ password })
        .where('id = :userId', { userId })
        .execute();

      return responseUpdated();
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.type', 't')
      .where('u.email = :email')
      .andWhere('u.status = :act')
      .setParameters({ email, act: Code.ACT })
      .getOne();
  }

  async findById(userId: number): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.type', 't')
      .where('u.id = :userId')
      .andWhere('u.status = :act')
      .setParameters({ userId, act: Code.ACT })
      .getOne();
  }

  async advisoryEmailValidation(email: string) {
    const isEmailForm = await this.isEmailForm(email);
    if (!isEmailForm) {
      return responseNotAcceptable('올바른 이메일 형식이 아닙니다.');
    }
    const hasEmail = await this.hasEmail(email);
    if (!hasEmail) {
      return responseNotAcceptable('등록된 자문단 정보가 없습니다.');
    }

    const {
      statusCode,
      data,
      message,
    } = await this.emailValidationLogService.create(email);
    if (statusCode !== HttpStatus.OK) {
      return responseNotAcceptable(message);
    }

    return await this.sendEmailValidationCode(data.email, data.code);
  }

  async emailValidation(email: string) {
    const isEmailForm = await this.isEmailForm(email);
    if (!isEmailForm) {
      return responseNotAcceptable('올바른 이메일 형식이 아닙니다.');
    }
    const hasEmail = await this.hasEmail(email);
    if (hasEmail) {
      return responseNotAcceptable('이미 가입 중인 이메일입니다.');
    }

    const {
      statusCode,
      data,
      message,
    } = await this.emailValidationLogService.create(email);
    if (statusCode !== HttpStatus.OK) {
      return responseNotAcceptable(message);
    }

    return await this.sendEmailValidationCode(data.email, data.code);
  }

  async sendEmailValidationCode(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'contact@hlabtech.com',
        subject: '[국립소방연구원] 이메일 인증 안내입니다.',
        html: emailValidationForm(email, code),
      });

      return responseOk({}, {}, '이메일로 인증번호를 보내드렸습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async hasEmail(email: string) {
    const count = await this.userRepository
      .createQueryBuilder()
      .where('email = :email')
      .andWhere('status = :act')
      .setParameters({ act: Code.ACT, email })
      .getCount();

    if (count > 0) {
      return true;
    }

    return false;
  }

  isEmailForm(email: string): boolean {
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(email);
  }

  /**
   * 8 ~ 10자 영문, 숫자 조합.
   * */
  isAcceptablePassword(password: string): boolean {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
    return regExp.test(password);
  }
}
