import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/strategy/local-auth.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  changePasswordUserDto,
  createAdminUserDto,
  createUserDto,
  emailValidationDto,
  findUserEmailDto,
  indexUserDto,
  loginUserDto,
  searchAdvisoryUserDto,
} from '../module/DTOs/user.dto';
import { Code } from '../module/entities/code.entity';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

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
  index(@Query() data: indexUserDto) {
    return this.userService.index(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get('search-advisory')
  searchAdvisory(@Query() { name }: searchAdvisoryUserDto) {
    return this.userService.searchAdvisory(name);
  }

  @Post('create')
  create(@Body() data: createUserDto) {
    return this.userService.create(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Post('create-admin')
  createAdmin(@Request() { user }, @Body() data: createAdminUserDto) {
    return this.userService.createAdmin(user.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Delete(':userId')
  destroy(@Request() { user }, @Param('userId') userId: number) {
    return this.userService.destroy(user.id, userId);
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Request() { user }, @Body() data: changePasswordUserDto) {
    return this.userService.changePassword(user.id, data);
  }
}
