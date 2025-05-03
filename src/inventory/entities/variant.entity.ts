// src/inventory/entities/variant.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inventory } from './inventory.entity'; // Import the Inventory entity

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sku: string;

  @Column()
  quantityAvailable: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.variants)
  inventory: Inventory;
}
