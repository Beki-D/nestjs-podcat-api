// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EpisodesModule } from './episodes/episodes.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [EpisodesModule, CategoriesModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
