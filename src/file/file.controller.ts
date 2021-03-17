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

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @UseGuards(JwtOrganizationGuard)
  @Post('request')
  @UseInterceptors(
    FileInterceptor('file', fileLocalOptions('./public/request')),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptions)
  create(
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
