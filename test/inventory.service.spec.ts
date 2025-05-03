import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryService } from '../src/inventory/inventory.service';
import { Inventory } from '../src/inventory/entities/inventory.entity';
import { Repository } from 'typeorm';
import * as imageDownloader from '../src/utils/image-downloader';

const mockInventory: Partial<Inventory>[] = [
  {
    shopifyProductId: 'gid://shopify/Product/123',
    title: 'Product 1',
    variantTitle: 'Variant A',
    sku: 'SKU001',
    quantityAvailable: 10,
    imagePath: 'images/mock.jpg',
  },
];

describe('InventoryService', () => {
  let service: InventoryService;
  let repo: Repository<Inventory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: {
            create: jest.fn((dto) => dto),
            save: jest.fn((entities) => entities),
            find: jest.fn().mockResolvedValue(mockInventory),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repo = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockInventory);
    });
  });

  describe('saveInventoryFromShopify', () => {
    it('should save inventory records from Shopify data', async () => {
      jest.spyOn(imageDownloader, 'downloadImage').mockResolvedValue('images/fake.jpg');
      const shopifyMockData = [
        {
          id: 'gid://shopify/Product/123',
          title: 'Product 1',
          images: { edges: [{ node: { url: 'http://image.com/a.jpg' } }] },
          variants: {
            edges: [
              {
                node: {
                  title: 'Variant A',
                  sku: 'SKU001',
                  quantityAvailable: 10,
                },
              },
            ],
          },
        },
      ];
      const result = await service.saveInventoryFromShopify(shopifyMockData);
      expect(repo.save).toHaveBeenCalled();
    });
  });
});
