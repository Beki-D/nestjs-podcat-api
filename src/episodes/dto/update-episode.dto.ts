// src/episodes/dto/update-episode.dto.ts

import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateEpisodeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categoryid?: string;
}
