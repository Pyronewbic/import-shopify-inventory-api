// src/inventory/entities/inventory.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shopifyProductId: string;

  @Column()
  title: string;

  @Column()
  variantTitle: string;

  @Column()
  sku: string;

  @Column()
  quantityAvailable: number;

  // Change this to a string type
  @Column()
  imagePath: string;  // This will store the URL or file path as a string
}
