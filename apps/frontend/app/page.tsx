import { SeasonWithChampionAndConstructorEntity } from '@nextjs-expressjs-postgre-sql/shared';
import { H1 } from '@/app/ui/typography/h1';
import Link from 'next/link';
import { backendDomain } from '@/app/constants/backend-domain';

export default async function Index() {
  const seasons: SeasonWithChampionAndConstructorEntity[] = await (
    await fetch(`${backendDomain}/api/seasons/champions?startYear=2005`, {
      cache: 'force-cache',
    })
  )?.json();

  return (
    <>
      <div className={'container max-md:p-0 mx-auto'}>
        <div className={'bg-content section p-8'}>
          <H1 className={'mb-8'}>Season World Champions</H1>
          <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'}>
            {seasons.map((season, index) => (
              <Link
                key={`card-${index}`}
                href={`/season-result/${season.year}`}
              >
                <div
                  className={
                    'p-4 rounded-lg shadow-md h-full text-content-foreground bg-content hover:text-content hover:bg-content-foreground cursor-pointer'
                  }
                >
                  <div className={'flex flex-col text-center'}>
                    <div className={'text-xl'}>{season.year}</div>
                    <div className={'text-3xl font-bold'}>
                      {season.champion.fullName}
                    </div>
                    <div className={'text-lg'}>
                      {season.champion.nationality}, {season.championConstructor.name}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
