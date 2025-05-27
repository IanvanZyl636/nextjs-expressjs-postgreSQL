import { Skeleton } from '@/app/ui/skeleton';

export default function Loading() {
  return (
    <div className={'container max-md:p-0 mx-auto'}>
      <div className={'bg-content section overflow-auto p-8'}>
        <Skeleton className={'mb-8 w-72 h-12'}/>
        <div className={'hidden md:grid grid-cols-4 h-full w-full gap-8'}>
          {[...Array(4*6)].map((_, i) => (<Skeleton key={`skeleton-${i}`} className={'h-24 w-full'}/>))}
        </div>
        <div className={'grid md:hidden grid-cols-2 h-full w-full gap-8'}>
          {[...Array(2*6)].map((_, i) => (<Skeleton key={`skeleton-${i}`} className={'h-24 w-full'}/>))}
        </div>
      </div>
    </div>
  );
}