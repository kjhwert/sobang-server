import { User } from '../entities/user/user.entity';
import { PickType } from '@nestjs/swagger';

export class loginUserDto extends PickType(User, ['email', 'password']) {}
