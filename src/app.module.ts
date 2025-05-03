import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/entities/inventory.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ShopifyCronService } from './inventory/inventory.scheduler';
import { ShopifyModule } from './shopify/shopify.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Schedule for cron jobs
    ScheduleModule.forRoot(),

    // TypeORM setup for PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER || 'testuser',
      password: process.env.POSTGRES_PASSWORD || 'testpassword',
      database: process.env.POSTGRES_DB || 'testdb',
      entities: [Inventory],
      synchronize: true,
      retryAttempts: 5, // Increase retry attempts for DB connection
      retryDelay: 3000, // Increase delay between retries
    }),

    // Your modules
    InventoryModule,
    ShopifyModule,

    // Configuration module for env variables
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available throughout your app
    }),
  ],
  providers: [
    // Cron job service
    ShopifyCronService,
  ],
})
export class AppModule {}
