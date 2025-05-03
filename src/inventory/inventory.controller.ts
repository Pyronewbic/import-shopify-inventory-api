import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(): Promise<any[]> {
    const inventory = await this.inventoryService.findAll();
    return inventory.map((item) => ({
      ...item,
      imageUrl: item.imagePath
        ? `${process.env.BASE_URL || 'http://localhost:3000'}/${item.imagePath.replace(/\\/g, '/')}`
        : null,
    }));
  }
}