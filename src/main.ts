import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 애플리케이션 생성
  const app = await NestFactory.create(AppModule);

  // CORS 활성화
  app.enableCors();

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Attendance API') // Swagger 제목
    .setDescription('API for managing attendance') // 설명
    .setVersion('1.0') // 버전
    .addTag('users') // 태그 추가
    .build();

  // Swagger 문서 생성 및 경로 설정
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // Swagger UI: /api

  // 글로벌 프리픽스 설정
  app.setGlobalPrefix('api'); // 모든 경로 앞에 '/api'가 추가됨

  // 애플리케이션 실행
  await app.listen(4000);
}
bootstrap();
