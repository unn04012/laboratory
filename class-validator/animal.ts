import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsString, IsBoolean } from 'class-validator';

enum AnimalEnum {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
}
type AnimalType = keyof typeof AnimalEnum;

export class Animal {
  @Expose({ groups: Object.values(AnimalEnum) })
  @IsDefined({ groups: Object.values(AnimalEnum) })
  readonly name: string;

  @Expose({ groups: Object.values(AnimalEnum) })
  readonly type: AnimalType;

  @Expose({ groups: Object.values(AnimalEnum) })
  @IsNumber({ groups: Object.values(AnimalEnum) })
  readonly age?: number;

  // DOG 고유 속성들
  @Expose({ groups: [AnimalEnum.DOG] })
  @IsString({ groups: [AnimalEnum.DOG] })
  readonly breed?: string; // 견종

  @Expose({ groups: [AnimalEnum.DOG] })
  @IsBoolean({ groups: [AnimalEnum.DOG] })
  readonly isTrained?: boolean; // 훈련 여부

  @Expose({ groups: [AnimalEnum.DOG] })
  @IsNumber({ groups: [AnimalEnum.DOG] })
  readonly walkingHoursPerDay?: number; // 일일 산책 시간

  // CAT 고유 속성들
  @Expose({ groups: [AnimalEnum.CAT] })
  @IsBoolean({ groups: [AnimalEnum.CAT] })
  readonly isIndoor?: boolean; // 실내/실외

  @Expose({ groups: [AnimalEnum.CAT] })
  @IsString({ groups: [AnimalEnum.CAT] })
  readonly furPattern?: string; // 털 패턴 (tabby, solid, calico 등)

  @Expose({ groups: [AnimalEnum.CAT] })
  @IsNumber({ groups: [AnimalEnum.CAT] })
  readonly clawSharpness?: number; // 발톱 날카로움 (1-10)

  // BIRD 고유 속성들
  @Expose({ groups: [AnimalEnum.BIRD] })
  @IsNumber({ groups: [AnimalEnum.BIRD] })
  readonly wingLength?: number; // 날개 길이

  @Expose({ groups: [AnimalEnum.BIRD] })
  @IsBoolean({ groups: [AnimalEnum.BIRD] })
  readonly canFly?: boolean; // 비행 가능 여부

  @Expose({ groups: [AnimalEnum.BIRD] })
  @IsString({ groups: [AnimalEnum.BIRD] })
  readonly beakType?: string; // 부리 타입 (curved, straight, hooked 등)

  @Expose({ groups: [AnimalEnum.BIRD] })
  @IsNumber({ groups: [AnimalEnum.BIRD] })
  readonly flightSpeed?: number; // 비행 속도 (km/h)
}
