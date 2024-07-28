import { IAnimal } from '../animal.interface';
import { AnimalKind } from '../animal.types';

export interface IAnimalfactory {
  getAnimal(kind: AnimalKind): Promise<IAnimal>;
}
