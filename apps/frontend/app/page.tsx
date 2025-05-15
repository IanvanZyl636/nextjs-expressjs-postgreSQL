import { shared } from '@nextjs-expressjs-postgre-sql/shared';

export default function Index() {
  return <div>{shared()}</div>;
}
