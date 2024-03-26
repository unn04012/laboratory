export enum YesOrNoEnum {
  YES = 'YES',
  NO = 'NO',
}

export type YesOrNo = keyof typeof YesOrNoEnum;

export type Nullable<T> = T | null;
