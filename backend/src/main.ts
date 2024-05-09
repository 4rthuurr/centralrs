import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Response } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class HeadersHook implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res: Response = context.switchToHttp().getResponse();

    res.setHeader('X-Powered-By', 'https://github.com/4rthuurr/centralrs');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return next.handle();
  }
}

const server_port = 1337; 

async function init(server_port : number) {
  const app = await NestFactory.create(AppModule);

  const cors_options = {
    origin: "*"
  };

  const docs_config = new DocumentBuilder()
    .setTitle('CentralRS-Backend')
    .setDescription('Documentação da API do Backend da CentralRS')
    .setVersion('2.0')
    .build();

    const document = SwaggerModule.createDocument(app, docs_config);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'CentralRS API - Documentação'
    });
    
  app.useGlobalInterceptors(new HeadersHook());
  app.enableCors(cors_options);

  await app.listen(server_port);
}


init(server_port);
