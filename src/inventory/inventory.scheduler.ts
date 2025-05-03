import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShopifyService } from '../shopify/shopify.service';
import { InventoryService } from './inventory.service';

@Injectable()
export class ShopifyCronService {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Cron('* * * * *')
  async runCronJob() {
    await this.importShopifyInventory();
  }

  public async importShopifyInventory() {
    const products = await this.shopifyService.fetchInventory();
    await this.inventoryService.saveInventoryFromShopify(products);
    console.log('✔ Inventory imported into DB');
  }
}