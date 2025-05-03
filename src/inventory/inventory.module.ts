// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  providers: [InventoryService],
  exports: [InventoryService],  // Make sure InventoryService is exported
})
export class InventoryModule {}
