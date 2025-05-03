import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Inventory } from '../src/inventory/entities/inventory.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get(DataSource);

    // Initialize DB connection
    await dataSource.initialize();

    // Seed mock inventory data for PostgreSQL
    const inventoryRepo = dataSource.getRepository(Inventory);
    const mockInventory = [
      {
        shopifyProductId: 'gid://shopify/Product/123',
        title: 'Product 1',
        variantTitle: 'Variant A',
        sku: 'SKU001',
        quantityAvailable: 10,
        imagePath: 'images/mock.jpg',
      },
    ];

    await inventoryRepo.save(mockInventory);
    await app.init();
  });

  it('/inventory (GET)', async () => {
    return request(app.getHttpServer())
      .get('/inventory')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe('Product 1');
        expect(res.body[0].variantTitle).toBe('Variant A');
      });
  });

  afterAll(async () => {
    await dataSource.dropDatabase(); // Clean up DB after tests
    await dataSource.destroy(); // Close connection
    await app.close();
  });
});
