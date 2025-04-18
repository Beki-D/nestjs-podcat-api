// src/episodes/episodes.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ConfigService } from '../config/config.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class EpisodesService {
  private client: ApolloClient<any>;

  constructor(
    private configService: ConfigService,
    private categoriesService: CategoriesService,
  ) {
    this.client = new ApolloClient({
      uri: this.configService.hasuraGraphqlEndpoint,
      cache: new InMemoryCache(),
      headers: {
        'x-hasura-admin-secret': this.configService.hasuraAdminSecret,
      },
    });
    //Test Hasura connection
    this.testHasuraConnection();
  }

  private async testHasuraConnection() {
    try {
      const query = gql`
        query TestConnection {
          __schema {
            queryType {
              name
            }
          }
        }
      `;
      await this.client.query({ query });
      console.log(
        '✅ Hasura connection successful:',
        this.configService.hasuraGraphqlEndpoint,
      );
    } catch (error) {
      console.error('❌ Hasura connection failed:', error.message);
    }
  }

  // Fetch all episodes with sorting
  async findAll(sort: 'asc' | 'desc') {
    const query = gql`
      query GetEpisodes($sort: order_by!) {
        episodes(order_by: { name: $sort }) {
          id
          name
          description
          featured
          categoryid
        }
      }
    `;
    try {
      const { data } = await this.client.query({
        query,
        variables: { sort },
        fetchPolicy: 'no-cache', // Prevent caching for fresh data
      });
      return data.episodes.map(({ __typename, ...rest }) => rest);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw new InternalServerErrorException('Failed to fetch episodes');
    }
  }

  // Find featured episodes
  async findFeatured() {
    const query = gql`
      query GetFeaturedEpisodes {
        episodes(where: { featured: { _eq: true } }) {
          id
          name
          description
          featured
          categoryid
        }
      }
    `;
    try {
      const { data } = await this.client.query({ query });
      return data.episodes.map(({ __typename, ...rest }) => rest);
    } catch (error) {
      console.error('Error fetching featured episodes:', error);
      throw new InternalServerErrorException(
        'Failed to fetch featured episodes',
      );
    }
  }

  // Find a single episode by ID
  async findOne(id: string) {
    const query = gql`
      query GetEpisode($id: uuid!) {
        episodes_by_pk(id: $id) {
          id
          name
          description
          featured
          categoryid
        }
      }
    `;
    try {
      const { data } = await this.client.query({
        query,
        variables: { id },
        fetchPolicy: 'no-cache', // Prevent caching for fresh data
      });
      if (!data.episodes_by_pk) {
        throw new NotFoundException(`Episode with ID ${id} not found`);
      }
      const { __typename, ...rest } = data.episodes_by_pk;
      return rest;
    } catch (error) {
      console.error('Error fetching episode:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch episode');
    }
  }

  // Create a new episode
  async create(createEpisodeDto: CreateEpisodeDto) {
    try {
      await this.categoriesService.findOne(createEpisodeDto.categoryid);
      const mutation = gql`
        mutation CreateEpisode($input: episodes_insert_input!) {
          insert_episodes_one(object: $input) {
            id
            name
            description
            featured
            categoryid
          }
        }
      `;
      console.log('Mutation input:', createEpisodeDto);
      const { data, errors } = await this.client.mutate({
        mutation,
        variables: { input: createEpisodeDto },
      });
      if (errors) {
        console.error('GraphQL mutation errors:', errors);
        throw new InternalServerErrorException(
          'Failed to create episode in Hasura',
        );
      }
      const { __typename, ...rest } = data.insert_episodes_one;
      return rest;
    } catch (error) {
      console.error('Error creating episode:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Category with ID ${createEpisodeDto.categoryid} not found`,
        );
      }
      throw new InternalServerErrorException(
        `Failed to create episode: ${error.message}`,
      );
    }
  }

  // Update an existing episode
  async update(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    try {
      if (updateEpisodeDto.categoryid) {
        await this.categoriesService.findOne(updateEpisodeDto.categoryid);
      }
      const mutation = gql`
        mutation UpdateEpisode($id: uuid!, $input: episodes_set_input!) {
          update_episodes_by_pk(pk_columns: { id: $id }, _set: $input) {
            id
            name
            description
            featured
            categoryid
          }
        }
      `;
      console.log('Mutation input:', updateEpisodeDto);
      const { data, errors } = await this.client.mutate({
        mutation,
        variables: { id, input: updateEpisodeDto },
      });
      if (errors) {
        console.error('GraphQL mutation errors:', errors);
        throw new InternalServerErrorException(
          'Failed to update episode in Hasura',
        );
      }
      if (!data.update_episodes_by_pk) {
        throw new NotFoundException(`Episode with ID ${id} not found`);
      }
      const { __typename, ...rest } = data.update_episodes_by_pk;
      return rest;
    } catch (error) {
      console.error('Error updating episode:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to update episode: ${error.message}`,
      );
    }
  }

  // Remove an episode by ID
  async remove(id: string) {
    try {
      const mutation = gql`
        mutation DeleteEpisode($id: uuid!) {
          delete_episodes_by_pk(id: $id) {
            id
            name
            description
            featured
            categoryid
          }
        }
      `;
      console.log('Deleting episode with ID:', id);
      const { data, errors } = await this.client.mutate({
        mutation,
        variables: { id },
      });
      if (errors) {
        console.error('GraphQL mutation errors:', errors);
        throw new InternalServerErrorException(
          'Failed to delete episode in Hasura',
        );
      }
      if (!data.delete_episodes_by_pk) {
        throw new NotFoundException(`Episode with ID ${id} not found`);
      }
      const { __typename, ...rest } = data.delete_episodes_by_pk;
      return rest;
    } catch (error) {
      console.error('Error deleting episode:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to delete episode: ${error.message}`,
      );
    }
  }
}
