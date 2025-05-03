import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variant } from './variant.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  shopifyProductId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  svgImage: string; // Store SVG as string

  @Column({ nullable: true })
  imagePath: string; // Path to saved PNG

  @OneToMany(() => Variant, (variant) => variant.inventory, {
    cascade: true,
    eager: true,
  })
  variants: Variant[];
}
