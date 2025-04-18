// File: src/episodes/dto/update-episode.dto.ts
/**
 * Data Transfer Object (DTO) for updating an existing episode.
 * Validates and sanitizes input data for episode updates.
 * @example
 * {
 *   "name": "Updated Episode",
 *   "description": "Updated description",
 *   "featured": false,
 *   "categoryid": "9cbfbbd6-1a86-499f-9afc-5d9dfbffc1c4"
 * }
 */

import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { SanitizeXSS, TransformXSS } from 'src/decorators/sanitize.decorator';

export class UpdateEpisodeDto {
  @IsString()
  @IsOptional()
  @SanitizeXSS()
  @TransformXSS()
  name?: string;

  @IsString()
  @IsOptional()
  @SanitizeXSS()
  @TransformXSS()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true)
  featured?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  categoryid?: string;
}
