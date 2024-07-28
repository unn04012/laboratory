import { Module } from '@nestjs/common';
import { AnimalFactory } from './animal-factory/animal-factory';
import { Lion, Owl, Tiger } from './animal.interface';
import { AnimalService } from './animal.service';
import { Tokens } from './tokens';

@Module({
  imports: [],
  providers: [
    AnimalService,
    {
      provide: Tokens.LION,
      useClass: Lion,
    },
    {
      provide: Tokens.TIGER,
      useClass: Tiger,
    },
    {
      provide: Tokens.OWL,
      useClass: Owl,
    },
    {
      provide: Tokens.animalFactory,
      useClass: AnimalFactory,
    },
  ],
})
export class AnimalModule {}
