import { extname } from 'path';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { diskStorage } from 'multer';
import { NotAcceptableException } from '@nestjs/common';

export const editFileName = async (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const randomName = randomStringGenerator();
  callback(null, `${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new NotAcceptableException('이미지 파일만 업로드 가능합니다.'),
      false,
    );
  }
  callback(null, true);
};

export const fileLocalOptions = (destination: string) => {
  return {
    storage: diskStorage({
      destination,
      filename: editFileName,
    }),
    fileFilter: (req, file, callback) => {
      callback(null, true);
    },
  };
};

export const apiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
