import { Test } from '@nestjs/testing';
import { AnimalModule } from '../animal.module';
import { AnimalService } from '../animal.service';

describe('AnimalService test', () => {
  let service: AnimalService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AnimalModule],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
  });

  test('Lion 동물을 요청할 경우 Lion 객체가 만들어져야 한다', async () => {
    const lion = await service.getAnimal('LION');

    expect(lion.name).toBe('Lion');
  });

  test('Tiger 동물을 요청할 경우 Tiger 객체가 만들어져야 한다', async () => {
    const animal = await service.getAnimal('TIGER');

    expect(animal.name).toBe('Tiger');
  });

  test('Owl 동물을 요청할 경우 Owl 객체가 만들어져야 한다', async () => {
    const animal = await service.getAnimal('OWL');

    expect(animal.name).toBe('Owl');
  });
});
