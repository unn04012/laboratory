import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentRepository {
  constructor() {}

  public async save(content: string) {
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log(content);
        resolve(null);
      }, 0),
    );
  }
}
