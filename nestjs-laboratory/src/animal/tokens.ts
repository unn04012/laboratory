import { AnimalKindEnum } from './animal.types';

export const Tokens = {
  animalFactory: Symbol.for('animalFactory'),
  LION: AnimalKindEnum.LION,
  TIGER: AnimalKindEnum.TIGER,
  OWL: AnimalKindEnum.OWL,
};
