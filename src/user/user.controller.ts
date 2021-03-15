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
import {
  createUserDto,
  findUserEmailDto,
  loginUserDto,
} from '../module/DTOs/user.dto';
import { Code } from '../module/entities/code.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() { user }, @Body() data: loginUserDto) {
    return user;
  }

  @Post('create')
  create(@Body() data: createUserDto) {
    return this.userService.create(data);
  }

  @Get('email-validation')
  emailValidation(@Query('email') email: string) {
    return this.userService.emailValidation(email);
  }

  @Get('find-email')
  findUserEmail(@Query() query: findUserEmailDto) {
    let type = Code.ORGANIZATION;
    if (query.type === 'advisory') {
      type = Code.ADVISORY;
    }

    return this.userService.findUserEmail(type, query);
  }

  @Get('find-password')
  findUserPassword(@Query('email') email: string) {
    return this.userService.findUserPassword(email);
  }
}
