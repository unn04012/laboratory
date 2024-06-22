import * as uuid from 'uuid';
import { V4 } from 'paseto';
(async () => {
  const key = await V4.generateKey('public', { format: 'paserk' });
  const userId = uuid.v4();

  const KEY = 'test';

  const token = await V4.sign({ usr: userId }, key.secretKey);
  console.log(token);

  const verifyResult = await V4.verify(token, key.publicKey);

  console.log(verifyResult);
})();
