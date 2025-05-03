// src/inventory/inventory.module.ts
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventory]),
        HttpModule,  // Add HttpModule here
      ],
  providers: [InventoryService],
  exports: [InventoryService],  // Make sure InventoryService is exported
})
export class InventoryModule {}
