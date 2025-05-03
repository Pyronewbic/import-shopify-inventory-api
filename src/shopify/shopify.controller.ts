import { Controller, Post, Get } from '@nestjs/common';
import { ShopifyCronService } from '../inventory/inventory.scheduler';

@Controller('shopify')
export class ShopifyController {
  constructor(private readonly cronService: ShopifyCronService) {}

  @Post('sync')
  async manualSync() {
    await this.cronService.importShopifyInventory(); // call the public method
    return { message: 'Manual sync triggered' };
  }

//   @Get('run')
//   async triggerCron() {
//     console.log('Manually triggering cron job...');
//     await this.cronService.handleCron();
//     return 'Cron job has been triggered manually!';
//   }

}