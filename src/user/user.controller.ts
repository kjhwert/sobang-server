import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/strategy/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { loginUserDto } from '../module/DTOs/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() { user }, @Body() data: loginUserDto) {
    return user;
  }

  @Get('email-validation')
  emailValidation(@Query('email') email: string) {
    return this.userService.emailValidation(email);
  }
}
