export type WallMaterial = 'TREE' | 'CEMENT';
export type DoorMaterial = 'WOOD' | 'STEEL';
export type RoofShape = 'TRIANGLE' | 'ELLIPSE';
export type House = {
  roof: {
    material: WallMaterial;
    shape: RoofShape;
  };
  doors: {
    count: number;
    material: DoorMaterial;
  };
  wall: { material: WallMaterial; size: number };
  window: {
    count: number;
    shape: RoofShape;
  };
  swimmingPool?: {
    width: number;
    height: number;
  };
};

export interface IHouseBuilder {
  /**
   * 벽을 생성합니다.
   * @param size 벽 갯수
   * @param material 벽 재료
   */
  wall(size: number, material: WallMaterial): Omit<IHouseBuilder, 'wall'>;

  /**
   * 문을 생성합니다.
   */
  doors(count: number, material: DoorMaterial): Omit<IHouseBuilder, 'doors'>;

  /**
   * 창문을 생성합니다.
   */
  window(count: number, shape: RoofShape): Omit<IHouseBuilder, 'window'>;

  /**
   * 지붕을 생서합니다
   * @param shape
   * @param material
   */
  roof(shape: RoofShape, material: WallMaterial): Omit<IHouseBuilder, 'roof'>;

  /**
   * 수영장을 생성합니다.
   */
  swimmingPool(width: number, height: number): Omit<IHouseBuilder, 'swimmingPool'>;

  build(): House;
}
