import axios from 'axios';
import { shared } from '@nextjs-expressjs-postgre-sql/shared';

describe('GET /', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: shared() });
  });
});
