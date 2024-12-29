import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemFindQueryBuilder } from '../repository/item-query-builder';
import { ProductRepository } from '../repository/product.repository';
import { ProductSchema } from '../schemas/product.schema';

describe('ItemFindQueryBuilder', () => {
  let productRepo: ProductRepository;
  let mockRepo: jest.Mocked<Repository<ProductSchema>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(ProductSchema),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    productRepo = module.get<ProductRepository>(ProductRepository);
    mockRepo = module.get<Repository<ProductSchema>>(getRepositoryToken(ProductSchema)) as jest.Mocked<Repository<ProductSchema>>;
  });

  describe('findOneBy', () => {
    it('should return a product by ID without locking', async () => {
      const mockQb = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Product', remainStock: 10 }),
      };

      mockRepo.createQueryBuilder.mockReturnValue(mockQb as any);

      const result = await productRepo.findOneBy(false).id(1);

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQb.where).toHaveBeenCalledWith('id =:productId', { productId: 1 });
      expect(mockQb.getOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1, name: 'Test Product', remainStock: 10 });
    });

    it('should return a product by ID with pessimistic locking', async () => {
      const mockQb = {
        where: jest.fn().mockReturnThis(),
        setLock: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test Product', remainStock: 10 }),
      };

      mockRepo.createQueryBuilder.mockReturnValue(mockQb as any);

      const result = await productRepo.findOneBy(true).id(1);

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQb.where).toHaveBeenCalledWith('id =:productId', { productId: 1 });
      expect(mockQb.setLock).toHaveBeenCalledWith('pessimistic_write');
      expect(mockQb.getOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1, name: 'Test Product', remainStock: 10 });
    });
  });
});
