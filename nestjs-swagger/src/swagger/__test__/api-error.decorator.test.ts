import { NotFoundException } from '../../exceptions/not-found-exception';
import {
  ApiErrorOptions,
  makeGroupedMetadata,
} from '../decorators/api-error.decorator';
import { ValidationException } from '../../exceptions/validation-exception';

describe('ApiError Decorator', () => {
  it('makeGroupedMetadata should group metadata by status code', () => {
    const errors: ApiErrorOptions[] = [
      {
        status: 404,
        error: class NotFoundProduct extends NotFoundException {
          constructor(message: string) {
            super('NOT_FOUND_PRODUCT', message);
          }
        },
        description: 'Product not found',
      },
      {
        status: 400,
        error: class InvalidFormat extends ValidationException {
          constructor(message: string) {
            super('INVALID_FORMAT', message);
          }
        },
        description: 'Invalid format',
      },
    ];

    const groupedMetadata = makeGroupedMetadata(errors);

    expect(groupedMetadata['404']).toBeDefined();
    expect(
      groupedMetadata['404'].content['application/json'].examples[
        'NotFoundProduct'
      ],
    ).toBeDefined();

    expect(groupedMetadata['400']).toBeDefined();
    expect(
      groupedMetadata['400'].content['application/json'].examples[
        'InvalidFormat'
      ],
    ).toBeDefined();
  });
});
