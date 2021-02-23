import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('소방리빙랩')
  .setDescription('소방리빙랩 웹 어플리케이션 API 명세서')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('user', '회원정보')
  .build();
