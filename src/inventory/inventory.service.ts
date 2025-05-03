import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class InventoryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find(); // Fetches all inventory items
  }

  async saveInventoryFromShopify(shopifyData: any[]): Promise<void> {
    for (const product of shopifyData) {
      const imageUrl = product.images.edges[0]?.node?.url;
      if (!imageUrl) continue;

      // Fetch image from the URL
      const response = await lastValueFrom(this.httpService.get(imageUrl, { responseType: 'arraybuffer' }));
      const originalImage = response.data;

      let svgString = null;
      let filePath = null;

      try {
        // Convert image to PNG (sharp can handle raster image formats like PNG, JPEG, etc.)
        const pngBuffer = await sharp(originalImage).png().toBuffer();

        // Save PNG locally
        const pngDir = path.join(__dirname, '..', '..', 'uploads', 'images');
        if (!fs.existsSync(pngDir)) fs.mkdirSync(pngDir, { recursive: true });

        // Sanitize product.id to remove invalid characters
        const sanitizedFileName = `${product.id.replace(/[\/:*?"<>|]/g, '-')}.png`; // Replace invalid characters
        filePath = path.join(pngDir, sanitizedFileName);

        // Write PNG image to local filesystem
        await sharp(pngBuffer).toFile(filePath);

        // Convert the original image to SVG string (store it in DB)
        const svgBuffer = await sharp(originalImage).toFormat('svg').toBuffer();
        svgString = svgBuffer.toString('utf-8'); // Convert the SVG buffer to string for DB storage
        console.log('SVG String:', svgString); // Log SVG string content

      } catch (error) {
        console.error('Error processing image:', error);
        continue; // Skip this image if processing fails
      }

      // If there's no SVG string, log it and skip the DB insert
      if (!svgString) {
        console.log(`No SVG content for product ${product.id}, skipping save`);
        continue;
      }

      // Save to DB
      const inventory = this.inventoryRepository.create({
        shopifyProductId: product.id,
        title: product.title,
        svgImage: svgString, // Store SVG string in DB
        imagePath: filePath,  // Store the PNG file path in DB
        variants: product.variants.edges.map((variant) => ({
          title: variant.node.title,
          sku: variant.node.sku,
          quantityAvailable: variant.node.quantityAvailable,
        })),
      });

      await this.inventoryRepository.save(inventory);
    }
  }
}
