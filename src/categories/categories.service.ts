// src/categories/categories.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ConfigService } from '../config/config.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private client: ApolloClient<any>;

  constructor(private configService: ConfigService) {
    this.client = new ApolloClient({
      uri: this.configService.hasuraGraphqlEndpoint,
      cache: new InMemoryCache(),
      headers: {
        'x-hasura-admin-secret': this.configService.hasuraAdminSecret,
      },
    });
  }

  // Fetch all categories
  async findAll() {
    const query = gql`
      query GetCategories {
        categories {
          id
          name
          description
        }
      }
    `;
    const { data } = await this.client.query({ query });
    return data.categories;
  }

  // Fetch a single category by ID
  async findOne(id: string) {
    const query = gql`
      query GetCategory($id: uuid!) {
        categories_by_pk(id: $id) {
          id
          name
          description
        }
      }
    `;
    const { data } = await this.client.query({
      query,
      variables: { id },
    });
    if (!data.categories_by_pk) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data.categories_by_pk;
  }

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto) {
    const mutation = gql`
      mutation CreateCategory($input: categories_insert_input!) {
        insert_categories_one(object: $input) {
          id
          name
          description
        }
      }
    `;
    const { data } = await this.client.mutate({
      mutation,
      variables: { input: createCategoryDto },
    });
    return data.insert_categories_one;
  }

  // Update an existing category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const mutation = gql`
      mutation UpdateCategory($id: uuid!, $input: categories_set_input!) {
        update_categories_by_pk(pk_columns: { id: $id }, _set: $input) {
          id
          name
          description
        }
      }
    `;
    const { data } = await this.client.mutate({
      mutation,
      variables: { id, input: updateCategoryDto },
    });
    if (!data.update_categories_by_pk) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data.update_categories_by_pk;
  }

  // Delete a category
  async remove(id: string) {
    const mutation = gql`
      mutation DeleteCategory($id: uuid!) {
        delete_categories_by_pk(id: $id) {
          id
          name
          description
        }
      }
    `;
    const { data } = await this.client.mutate({
      mutation,
      variables: { id },
    });
    if (!data.delete_categories_by_pk) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data.delete_categories_by_pk;
  }
}
