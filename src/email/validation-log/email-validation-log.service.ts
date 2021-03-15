import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailValidationLog } from '../../module/entities/user/email-validation-log.entity';
import { Repository } from 'typeorm';
import { responseCreated, responseNotAcceptable } from '../../module/common';

@Injectable()
export class EmailValidationLogService {
  constructor(
    @InjectRepository(EmailValidationLog)
    private emailRepository: Repository<EmailValidationLog>,
  ) {}

  async isValidated(email: string, code: string): Promise<boolean> {
    const count = await this.emailRepository
      .createQueryBuilder()
      .where('email = :email')
      .andWhere('code = :code')
      .setParameters({ email, code })
      .getCount();

    if (count > 0) {
      return true;
    }

    return false;
  }

  async create(
    email: string,
  ): Promise<{
    data?: { email?: string; code?: string };
    message: string;
    statusCode: HttpStatus;
  }> {
    try {
      const newLog = await this.emailRepository.create({ email });
      const { code } = await this.emailRepository.save(newLog);

      return responseCreated({ email, code });
    } catch (e) {
      return responseNotAcceptable(e.message);
    }
  }
}
