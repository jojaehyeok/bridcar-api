import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS 설정 (Next.js와 연동 시 필요)
  await app.listen(4000); // 4000번 포트로 서버 실행
}
bootstrap();
