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
  Header,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/strategy/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  advisoryUserExcelUploadDto,
  changePasswordUserDto,
  createAdminUserDto,
  createUserDto,
  emailValidationDto,
  findUserEmailDto,
  indexUserDto,
  loginUserDto,
  searchAdvisoryUserDto,
} from '../module/DTOs/user.dto';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import * as XLSX from 'xlsx';
import { Code } from '../module/entities/code.entity';
import { User } from '../module/entities/user/user.entity';
import { responseNotAcceptable } from '../module/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { apiBodyOptions } from '../module/file-upload.utils';

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
    if (Number(data.type) === Code.ADVISORY) {
      return this.userService.advisoryIndex(data);
    }
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

  @Get('advisory-email-validation')
  advisoryEmailValidation(@Query() { email }: emailValidationDto) {
    return this.userService.advisoryEmailValidation(email);
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

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get('excel-download')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=users.xlsx')
  async excelDownload(@Res() res, @Query('type') type: number) {
    let users = null;
    switch (type) {
      case Code.ORGANIZATION:
        const organizationUsers = await this.userService.getAllUsersByType(
          type,
        );
        users = organizationUsers.map(
          ({
            email,
            businessOwner,
            businessName,
            businessNo,
            createdAt,
          }: User) => {
            return {
              ?????????: email,
              ?????????: businessName,
              ????????????: businessOwner,
              ???????????????: businessNo,
              ????????????: createdAt,
            };
          },
        );
        break;
      case Code.ADVISORY:
        const advisoryUsers = await this.userService.getAllUsersByType(type);
        users = advisoryUsers.map(
          ({
            email,
            name,
            position,
            department,
            createdAt,
            advisoryCareer,
            fieldCareer,
            career,
            group,
          }: User) => {
            return {
              ?????????: email,
              ??????: name,
              ??????: department,
              ??????: position,
              '???????????? ??????': advisoryCareer,
              '?????? ???????????? ??????': fieldCareer,
              ??????: career,
              ??????: group,
              ????????????: createdAt,
            };
          },
        );
        break;
    }

    if (users === null) {
      return responseNotAcceptable('????????? ?????? ????????? ????????????.');
    }

    // step 1. workbook ??????
    const wb = XLSX.utils.book_new();
    // step 2. ?????? ?????????
    const newWorksheet = XLSX.utils.json_to_sheet(users);
    // step 3. workbook??? ???????????? ??????????????? ????????? ?????? ?????????.
    XLSX.utils.book_append_sheet(wb, newWorksheet, '?????????');
    // step 4. ????????? ????????????. (??????????????? ??????)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    // step 5. ????????? response ??????.
    res.end(Buffer.from(wbout, 'base64'));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Post('excel-upload-advisory')
  async excelUploadAdvisory(@UploadedFile() file) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    // ????????? sheet ??? ????????? ???????????????.
    const sheetName = workbook.SheetNames[0];
    // ????????? sheet ??? ???????????????.
    const sheet = workbook.Sheets[sheetName];

    const rows: Array<advisoryUserExcelUploadDto> = XLSX.utils.sheet_to_json(
      sheet,
      {
        header: [
          'type',
          'name',
          'department',
          'position',
          'email',
          'advisoryCareer',
          'fieldCareer',
          'career',
          'group',
        ],
        range: 1,
        defval: null,
      },
    );

    return this.userService.advisoryUserExcelUpload(rows);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @Get(':userId')
  show(@Param('userId') userId: number) {
    return this.userService.show(userId);
  }
}
