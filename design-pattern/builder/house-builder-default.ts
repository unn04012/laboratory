import { DoorMaterial, House, IHouseBuilder, RoofShape, WallMaterial } from './house-builder.interface';

export class HouseBuilderDefault implements IHouseBuilder {
  private _wall: { material: WallMaterial; size: number };
  private _swimmingPool?: { width: number; height: number };
  private _roof: { material: WallMaterial; shape: RoofShape };
  private _doors: { count: number; material: DoorMaterial };
  private _window: { count: number; shape: RoofShape };

  public wall(size: number, material: WallMaterial): IHouseBuilder {
    this._wall = { size, material };

    return this;
  }
  public doors(count: number, material: DoorMaterial): IHouseBuilder {
    this._doors = { count, material };

    return this;
  }
  public window(count: number, shape: RoofShape): IHouseBuilder {
    this._window = { count, shape };

    return this;
  }
  public roof(shape: RoofShape, material: WallMaterial): IHouseBuilder {
    this._roof = { shape, material };

    return this;
  }
  public swimmingPool(width: number, height: number): IHouseBuilder {
    this._swimmingPool = { width, height };

    return this;
  }

  public build(): House {
    return {
      wall: this._wall,
      swimmingPool: this._swimmingPool,
      roof: this._roof,
      doors: this._doors,
      window: this._window,
    };
  }
}
