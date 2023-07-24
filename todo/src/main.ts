import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ["asdf"]
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  const config = new DocumentBuilder()
  .setTitle('Swagger Test')
  .setDescription('this is the test of swagger')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3030);
  console.log("Connected");
}
bootstrap();
