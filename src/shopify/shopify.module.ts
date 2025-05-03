import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { ShopifyService } from './shopify.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule,
            ConfigModule
           ], // If you're using HttpService
  providers: [ShopifyService],
  exports: [ShopifyService], // 👈 this is important
})
export class ShopifyModule {}
