import { Inject, Injectable } from '@nestjs/common';
import { IAnimalfactory } from './animal-factory/animal-factory.interface';
import { AnimalKind } from './animal.types';
import { Tokens } from './tokens';

@Injectable()
export class AnimalService {
  constructor(@Inject(Tokens.animalFactory) private readonly _animalFactory: IAnimalfactory) {}

  public async getAnimal(kind: AnimalKind) {
    const animal = await this._animalFactory.getAnimal(kind);

    const { age, name, weight } = animal;

    return { age, name, weight };
  }
}
