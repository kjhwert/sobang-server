import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('소방리빙랩')
  .setDescription('소방리빙랩 웹 어플리케이션 API 명세서')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('user', '회원정보')
  .addTag('request', '서비스 신청')
  .addTag('notice', '공지사항')
  .addTag('faq', '자주 묻는 질문')
  .addTag('dev-opinion', '서비스 개선의견')
  .addTag('file', '첨부파일')
  .build();
