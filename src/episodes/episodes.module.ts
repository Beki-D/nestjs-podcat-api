// src/episodes/episodes.module.ts

import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { CategoriesModule } from '../categories/categories.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [CategoriesModule, ConfigModule],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
