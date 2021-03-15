import { HttpStatus } from '@nestjs/common';

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
  data,
  paging = {},
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
  message = '등록되었습니다.',
  statusCode = HttpStatus.CREATED,
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
