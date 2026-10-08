import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NodeNestPrisma API')
    .setDescription('API de usuarios com NestJS, Prisma, JWT, RBAC e Swagger.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documento = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documento, {
    swaggerOptions: { persistAuthorization: true },
  });

  const config = app.get(ConfigService);
  const porta = config.get<number>('PORT', 3000);

  await app.listen(porta);
  Logger.log(`API no ar em http://localhost:${porta}`, 'Bootstrap');
  Logger.log(`Swagger em http://localhost:${porta}/docs`, 'Bootstrap');
}

void bootstrap();
