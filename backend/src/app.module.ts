import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DesaparecidosController } from './routes/desaparecidos/desaparecidos.controller';

@Module({
  imports: [],
  controllers: [AppController, DesaparecidosController],
  providers: [AppService],
})
export class AppModule {}
