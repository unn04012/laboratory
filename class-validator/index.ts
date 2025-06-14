import { plainToInstance } from 'class-transformer';
import { Animal } from './animal';
import { validate } from 'class-validator';

async function transformAndValidateAnimalData(data: object) {
  const groups: string[] = [];
  if (data['type']) {
    const groupMapper = {
      DOG: 'DOG',
      CAT: 'CAT',
      BIRD: 'BIRD',
    };
    const mapper = groupMapper[data['type']];
    if (mapper) groups.push(mapper);
  }
  const dto = plainToInstance(Animal, data, { groups });

  const errors = await validate(dto, { groups });

  if (errors.length > 0) {
    console.error('Validation failed. Errors: ', errors);
    return null;
  }
}

// DOG 검증
const dogData = {
  name: 'Buddy',
  type: 'DOG',
  age: 3,
  breed: 'Golden Retriever',
  walkingHoursPerDay: 2,
  isTrained: true,
  flightSpeed: 25,
};

// CAT 검증
const catData = {
  name: 'Whiskers',
  type: 'CAT',
  age: 2,
  isIndoor: true,
  furPattern: null,
  clawSharpness: 8,
};

// BIRD 검증
const birdData = {
  name: 'Tweety',
  type: 'BIRD',
  age: 1,
  wingLength: 15,
  canFly: true,
  beakType: 'curved',
  flightSpeed: 25,
};

(async () => {
  await transformAndValidateAnimalData(dogData);
})();
