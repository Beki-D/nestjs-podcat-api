// src/config/config.service.ts
// This file contains the configuration service for the NestJS application. It retrieves configuration values from environment variables or provides default values.

import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {
    console.log('ConfigService initialized with:', {
      port: this.port,
      hasuraGraphqlEndpoint: this.hasuraGraphqlEndpoint,
    });
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }
  get hasuraGraphqlEndpoint(): string {
    return (
      this.configService.get<string>('HASURA_GRAPHQL_ENDPOINT') ||
      'http://localhost:8080/v1/graphql'
    );
  }
  get hasuraAdminSecret(): string {
    return this.configService.get<string>('HASURA_ADMIN_SECRET') || '';
  }
}
