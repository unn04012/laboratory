export interface IAnimal {
  name: string;
  weight: number;
  age: number;
}

export class Lion implements IAnimal {
  public name: string = 'Lion';
  public weight: number = 500;
  public age: number = 12;
}

export class Tiger implements IAnimal {
  public name: string = 'Tiger';
  public weight: number = 400;
  public age: number = 10;
}

export class Owl implements IAnimal {
  public name: string = 'Owl';
  public weight: number = 20;
  public age: number = 4;
}
