import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IAnimal } from '../animal.interface';
import { AnimalKind } from '../animal.types';
import { IAnimalfactory } from './animal-factory.interface';

@Injectable()
export class AnimalFactory implements IAnimalfactory {
  constructor(private readonly _moduleRef: ModuleRef) {}
  public async getAnimal(kind: AnimalKind): Promise<IAnimal> {
    const animal = (await this._moduleRef.resolve(kind)) as IAnimal;

    return animal;
  }
}
