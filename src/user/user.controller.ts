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
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  createUserDto,
  emailValidationDto,
  findUserEmailDto,
  indexUserDto,
  loginUserDto,
} from '../module/DTOs/user.dto';
import { Code } from '../module/entities/code.entity';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() { user }, @Body() data: loginUserDto) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get()
  index(@Query() data: indexUserDto) {}

  @Post('create')
  create(@Body() data: createUserDto) {
    return this.userService.create(data);
  }

  @Get('email-validation')
  emailValidation(@Query() { email }: emailValidationDto) {
    return this.userService.emailValidation(email);
  }

  @Get('find-email')
  findUserEmail(@Query() query: findUserEmailDto) {
    return this.userService.findUserEmail(query);
  }

  @Get('find-password')
  findUserPassword(@Query('email') email: string) {
    return this.userService.findUserPassword(email);
  }
}
