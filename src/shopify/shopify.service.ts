import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ShopifyService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const domain = this.configService.get('SHOPIFY_DOMAIN');
    const version = this.configService.get('SHOPIFY_API_VERSION');
    this.apiUrl = `https://${domain}/api/${version}/graphql.json`;
  }

  async fetchInventory(): Promise<any[]> {
    const token = this.configService.get('SHOPIFY_STOREFRONT_TOKEN');

    const query = `
      {
        products(first: 250) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    quantityAvailable
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await this.httpService.axiosRef.post(
      this.apiUrl,
      { query },
      {
        headers: {
          'X-Shopify-Storefront-Access-Token': token,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.data.products.edges.map((edge) => edge.node);
  }
}
