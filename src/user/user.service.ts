import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../module/entities/user/user.entity';
import { Repository } from 'typeorm';
import { Code } from '../module/entities/code.entity';
import { responseNotAcceptable, responseOk } from '../module/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailValidationLogService } from '../email/validation-log/email-validation-log.service';
import emailValidationForm from '../module/emailForm/emailValidationForm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly emailValidationLogService: EmailValidationLogService,
  ) {}

  async create() {
    /** validation code check */
  }

  async findByEmail(email: string) {
    return this.userRepository
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

    await this.sendEmailValidationCode(data.email, data.code);
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
