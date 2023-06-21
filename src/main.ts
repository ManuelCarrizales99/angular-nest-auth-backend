import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelist = [
    'http://localhost:4200',
    ];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  await app.listen( process.env.PORT ?? 3000);
}
bootstrap();
