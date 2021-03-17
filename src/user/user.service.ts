import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../module/entities/user/user.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import { responseNotAcceptable, responseOk } from '../module/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailValidationLogService } from '../email/validation-log/email-validation-log.service';
import emailValidationForm from '../module/emailForm/emailValidationForm';
import { createUserDto, findUserEmailDto } from '../module/DTOs/user.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly emailValidationLogService: EmailValidationLogService,
  ) {}

  async create(data: createUserDto) {
    const { email, code, name } = data;
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

    const hasEmail = await this.hasEmail(email);
    if (hasEmail) {
      return responseNotAcceptable('이미 가입 중인 이메일입니다.');
    }

    if (name) {
      return await this.createAdvisoryUser(data);
    }

    return await this.createOrganizationUser(data);
  }

  async findUserPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return responseNotAcceptable('일치하는 이메일 정보가 없습니다.');
    }

    try {
      const tempPassword = randomStringGenerator();
      const password = await bcrypt.hash(tempPassword, 10);

      await this.userRepository
        .createQueryBuilder()
        .update({ password })
        .where('id = :id', { id: user.id })
        .execute();

      await this.mailerService.sendMail({
        to: email,
        from: 'contact@hlabtech.com',
        subject: '[국립소방연구원] 임시 비밀번호 제공 안내입니다.',
        html: emailValidationForm(email, tempPassword),
      });

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

  async createAdvisoryUser(data: createUserDto) {
    const type = Code.ADVISORY;
    return await this.createUser(type, data);
  }

  async createUser(type: number, data: createUserDto) {
    try {
      const newUser = await this.userRepository.create({ ...data, type });
      await this.userRepository.save(newUser);

      return responseOk({}, {}, '등록 되었습니다.');
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder()
      .where('email = :email')
      .andWhere('status = :act')
      .setParameters({ email, act: Code.ACT })
      .getOne();
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
    if (statusCode !== HttpStatus.CREATED) {
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
