import { HttpStatus, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const MAIN_INDEX_ROW = 4;
export const PER_PAGE = 10;
export const SKIP_PAGE = (page: number) => {
  return (page - 1) * PER_PAGE;
};

export const pagination = (page: number, total = 0) => {
  if (total === 0) {
    return {
      totalPage: 1,
      startPage: 1,
      endPage: 1,
    };
  }
  const pageLength = 10;

  const totalPage = Math.ceil(total / PER_PAGE);
  const startPage = Math.floor((page - 1) / pageLength) * pageLength + 1;
  let endPage = startPage + pageLength - 1;
  if (totalPage <= endPage) {
    endPage = totalPage;
  }

  return {
    totalPage,
    startPage,
    endPage,
  };
};

export const responseOk = (
  data = null,
  paging = null,
  message = '',
  statusCode = HttpStatus.OK,
) => ({
  statusCode,
  data,
  paging,
  message,
});

export const responseCreated = (
  data = {},
  message = '등록 되었습니다.',
  statusCode = HttpStatus.OK,
) => ({
  statusCode,
  message,
  data,
});

export const responseUpdated = (
  data = {},
  message = '수정 되었습니다.',
  statusCode = HttpStatus.OK,
) => ({
  statusCode,
  message,
  data,
});

export const responseNotAuthorized = (
  message = '인증되지 않은 접근입니다.',
  statusCode = HttpStatus.UNAUTHORIZED,
) => ({
  message,
  statusCode,
});

export const responseNotAcceptable = (
  message = '',
  statusCode = HttpStatus.NOT_ACCEPTABLE,
) => ({
  statusCode,
  message,
});
