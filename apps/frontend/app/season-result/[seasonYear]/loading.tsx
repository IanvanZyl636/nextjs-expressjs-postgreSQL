import { Skeleton } from '@/app/ui/skeleton';

export default function Loading() {
  return (
    <div className={'container max-md:p-0 mx-auto'}>
      <div className={'bg-content section overflow-auto'}>
        <Skeleton className={'m-8 w-72 h-12'}/>
        <div className={'grid md:hidden grid-cols-4 h-full w-full gap-4'}>
          {[...Array(4*15)].map((_, i) => (<Skeleton key={`skeleton-${i}`} className={'h-8 w-full'}/>))}
          <Skeleton/>
        </div>
        <div className={'hidden md:grid  grid-cols-7 h-full w-full gap-4'}>
          {[...Array(7*15)].map((_, i) => (<Skeleton key={`skeleton-${i}`} className={'h-8 w-full'}/>))}
          <Skeleton/>
        </div>
      </div>
    </div>
  );
}