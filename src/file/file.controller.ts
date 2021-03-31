import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { apiBodyOptions, fileLocalOptions } from '../module/file-upload.utils';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtOrganizationGuard } from '../auth/jwt/jwt-organization.guard';
import { UploadedFile } from '@nestjs/common';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @UseGuards(JwtOrganizationGuard)
  @UseInterceptors(
    FileInterceptor('file', fileLocalOptions('./public/request')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Post('request')
  organizationUserRequestCreate(
    @UploadedFile() { mimetype, originalname, path, size },
    @Request() { user },
  ) {
    const data = {
      name: originalname,
      type: mimetype,
      path,
      size,
    };

    return this.fileService.create(user.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(
    FileInterceptor('file', fileLocalOptions('./public/test-operation')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Post('test-operation')
  testOperationCreate(
    @UploadedFile() { mimetype, originalname, path, size },
    @Request() { user },
  ) {
    const data = {
      name: originalname,
      type: mimetype,
      path,
      size,
    };

    return this.fileService.create(user.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(
    FileInterceptor('file', fileLocalOptions('./public/form-manage')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  @Post('form-manage')
  formManageCreate(
    @UploadedFile() { mimetype, originalname, path, size },
    @Request() { user },
  ) {
    const data = {
      name: originalname,
      type: mimetype,
      path,
      size,
    };

    return this.fileService.create(user.id, data);
  }
}
