// tests/inventory.controller.scheduler.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../src/inventory/inventory.controller';
import { InventoryService } from '../src/inventory/inventory.service';
import { ShopifyCronService } from '../src/inventory/inventory.scheduler';
import { ShopifyService } from '../src/shopify/shopify.service';

const mockInventory = [
  {
    id: 1,
    shopifyProductId: 'gid://shopify/Product/123',
    title: 'Product 1',
    variantTitle: 'Variant A',
    sku: 'SKU001',
    quantityAvailable: 10,
    imagePath: 'images/mock.jpg',
  },
];

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockInventory),
          },
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('should return inventory with image URLs', async () => {
    const result = await controller.getInventory();
    expect(result[0].imageUrl).toMatch(/http:\/\/localhost:3000\//);
    expect(result[0].title).toBe('Product 1');
  });
});

describe('InventoryScheduler', () => {
  let scheduler: ShopifyCronService;
  let shopifyService: ShopifyService;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopifyCronService,
        {
          provide: ShopifyService,
          useValue: {
            fetchInventory: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: InventoryService,
          useValue: {
            saveInventoryFromShopify: jest.fn(),
          },
        },
      ],
    }).compile();

    scheduler = module.get<ShopifyCronService>(ShopifyCronService);
    shopifyService = module.get<ShopifyService>(ShopifyService);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  it('should call ShopifyService and InventoryService to backup inventory', async () => {
    await scheduler.importShopifyInventory();
    expect(shopifyService.fetchInventory).toHaveBeenCalled();
    expect(inventoryService.saveInventoryFromShopify).toHaveBeenCalledWith([]);
  });
});
