import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { downloadImage } from '../utils/image-downloader';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly repo: Repository<Inventory>,
  ) {}

  async saveInventoryFromShopify(shopifyData: any[]) {
    const records: Inventory[] = [];

    for (const product of shopifyData) {
      const imageUrl = product.images.edges[0]?.node?.url;

      let localImagePath: string | null = null;
      if (imageUrl) {
        try {
          localImagePath = await downloadImage(imageUrl);
        } catch (e) {
          console.error(`Failed to download image for ${product.title}:`, e);
        }
      }

      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        records.push(
          this.repo.create({
            shopifyProductId: product.id,
            title: product.title,
            variantTitle: variant.title,
            sku: variant.sku,
            quantityAvailable: variant.quantityAvailable ?? 0,
            imagePath: localImagePath,
          }),
        );
      }
    }

    await this.repo.save(records);
  }

  async findAll(): Promise<Inventory[]> {
    return this.repo.find();
  }
}