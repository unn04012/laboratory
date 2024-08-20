import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RedisCommandHandler } from './redis-command.handler';
import { OrderRepository } from './repository/order.repository';
import { ProductRepository } from './repository/product.repository';
import { OrderSchema } from './schemas/order.schema';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema, OrderSchema])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, OrderRepository, RedisCommandHandler],
})
export class ProductModule {}
