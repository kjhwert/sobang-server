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
              이메일: email,
              상호명: businessName,
              대표자명: businessOwner,
              사업자번호: businessNo,
              등록일자: createdAt,
            };
          },
        );
        break;
      case Code.ADVISORY:
        const advisoryUsers = await this.userService.getAllUsersByType(type);
        users = advisoryUsers.map(
          ({ email, position, department, createdAt }: User) => {
            return {
              이메일: email,
              소속: department,
              직위: position,
              등록일자: createdAt,
            };
          },
        );
        break;
    }

    if (users === null) {
      return responseNotAcceptable('조회할 회원 정보가 없습니다.');
    }

    // step 1. workbook 생성
    const wb = XLSX.utils.book_new();
    // step 2. 시트 만들기
    const newWorksheet = XLSX.utils.json_to_sheet(users);
    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, '연락처');
    // step 4. 파일을 생성한다. (메모리에만 저장)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    // step 5. 파일을 response 한다.
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

    // 첫번째 sheet 의 이름을 조회합니다.
    const sheetName = workbook.SheetNames[0];
    // 첫번째 sheet 를 사용합니다.
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
