import { nodeShared } from '@nextjs-expressjs-postgre-sql/node-shared';

export default function Index() {
  return (
    <div>{nodeShared()} sad</div>
  );
}
