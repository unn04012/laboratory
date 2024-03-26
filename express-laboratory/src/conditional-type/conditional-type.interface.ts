import { Nullable, YesOrNo } from '../common/common.types';

export type Animal = {
  name: string;
};

type EntityOrNullable<Entity, OrReject extends YesOrNo> = OrReject extends 'YES' ? Entity : Nullable<Entity>;

type EntityNullable<T> = T extends 'YES' ? T : Nullable<T>;

/**
 * 조건부 타입을 반환하기 위한 인터페이스
 */
export interface IConditionalType {
  findOneBy(orReject: YesOrNo): {
    id(id: number): EntityOrNullable<Animal, typeof orReject>;
  };
}

class Mock {
  constructor(private readonly _repo: IConditionalType) {}

  public test() {
    const a = this._repo.findOneBy('YES').id(1);
  }
}
