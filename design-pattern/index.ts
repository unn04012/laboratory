import { HouseBuilderDefault } from './builder/house-builder-default';
import { IHouseBuilder } from './builder/house-builder.interface';

const houseBuilder: IHouseBuilder = new HouseBuilderDefault();

const result = houseBuilder.doors(4, 'STEEL').roof('ELLIPSE', 'CEMENT').wall(2, 'CEMENT').window(4, 'TRIANGLE').build();

console.log(result);
