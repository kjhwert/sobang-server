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
