// File: src/episodes/dto/create-episode.dto.ts
/**
 * Data Transfer Object (DTO) for creating a new episode.
 * Validates and sanitizes input data for episode creation.
 * @example
 * {
 *   "name": "Techy: Episode 1",
 *   "description": "First Techy episode",
 *   "featured": true,
 *   "categoryid": "9cbfbbd6-1a86-499f-9afc-5d9dfbffc1c4"
 * }
 */

import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { SanitizeXSS, TransformXSS } from 'src/decorators/sanitize.decorator';

export class CreateEpisodeDto {
  @IsString()
  @SanitizeXSS()
  @TransformXSS()
  name: string;

  @IsString()
  @SanitizeXSS()
  @TransformXSS()
  description: string;

  @IsBoolean()
  @Transform(({ value }) => value === true)
  featured?: boolean = false;

  @IsString()
  @IsNotEmpty()
  categoryid: string;
}
