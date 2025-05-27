import Link from 'next/link'
import { H1 } from '@/app/ui/typography/h1';

export default function NotFound() {
  return (
  <div className={'container max-md:p-0 mx-auto'}>
    <div className={'bg-content section p-8 flex flex-col justify-center'}>
      <div className={'flex flex-row w-full justify-center'}>
        <H1>404</H1>
        <div className={'border-l-2 ml-2 mr-2'}/>
        <div className={'flex flex-col justify-center'}>Not Found</div>
      </div>
      <div className={'flex flex-row w-full justify-center mt-8'}>This page could not be found</div>
      <div className={'flex flex-row w-full justify-center mt-8'}><Link href="/">Return Home</Link></div>
    </div>
  </div>
  )
}