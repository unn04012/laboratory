export enum AnimalKindEnum {
  LION = 'LION',
  TIGER = 'TIGER',
  OWL = 'OWL',
}
export type AnimalKind = keyof typeof AnimalKindEnum;

export type Animal = {
  name: string;
  weight: number;
  age: number;
};
