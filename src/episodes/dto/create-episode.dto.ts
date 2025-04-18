// src/episodes/dto/create-episode.dto.ts

import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsNotEmpty()
  categoryid: string;
}
