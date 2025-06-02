import { notFound } from 'next/navigation';
import { SeasonWithRacesEntity } from '@nextjs-expressjs-postgre-sql/shared';
import { H1 } from '@/app/ui/typography/h1';
import { cn } from '@/app/utils/cn';
import { backendDomain } from '@/app/constants/backend-domain';

export default async function SeasonResult({
  params,
}: {
  params: Promise<{ seasonYear: string }>;
}) {
  const { seasonYear } = await params;

  const season: SeasonWithRacesEntity = await (
    await fetch(
      `${backendDomain}/api/season/race-winners?seasonYear=${seasonYear}`,
      {
        cache: 'force-cache',
      }
    )
  )?.json();

  if (!season) return notFound();

  return (
    <>
      <div className={'container max-md:p-0 mx-auto'}>
        <div className={'bg-content section overflow-auto'}>
          <H1 className={'p-8'}>{seasonYear} Season Results</H1>
          <table
            className={
              'w-full text-left table-auto border-collapse border-spacing-6'
            }
          >
            <thead>
              <tr className={'border-b-2 border-content-foreground'}>
                <th>Round</th>
                <th>Race</th>
                <th>Circuit</th>
                <th>Location</th>
                <th>Winner</th>
                <th className={'text-center'}>Points</th>
                <th className={'text-center'}>Laps</th>
              </tr>
            </thead>
            <tbody>
              {season.races.map((race, index) => (
                <tr
                  key={`race-${index}`}
                  data-testid="race-row"
                  className={cn(
                    'border-b border-secondary',
                    season.champion.driverId === race.winner.driverId
                      ? 'text-content bg-content-foreground'
                      : ''
                  )}
                >
                  <td>{race.round}</td>
                  <td>{race.name}</td>
                  <td>{race.circuit.circuitName}</td>
                  <td>{`${race.circuit.location.locality}, ${race.circuit.location.country}`}</td>
                  <td>{`${race.winner.fullName}, ${race.winnerConstructor.name}`}</td>
                  <td className={'text-center'}>{race.points}</td>
                  <td className={'text-center'}>{race.laps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
