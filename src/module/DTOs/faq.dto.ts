import { PickType } from '@nestjs/swagger';
import { Faq } from '../entities/customer-service/faq.entity';

export class createFaqDto extends PickType(Faq, ['request', 'response']) {}
