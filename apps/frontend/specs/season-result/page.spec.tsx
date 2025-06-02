import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import SeasonResult from '../../app/season-result/[seasonYear]/page';

fdescribe('Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    enableFetchMocks();
    fetchMock.doMock();
  });

  it('should render successfully', async () => {
    const mockData = {
      id: '81e9d470-5b67-4610-a052-a8b4af24b884',
      year: 2005,
      champion: {
        driverId: 'alonso',
        fullName: 'Alonso',
        nationality: 'Spanish',
      },
      championConstructor: {
        name: 'Renault',
        nationality: 'French',
      },
      races: [
        {
          name: 'Australian Grand Prix',
          round: 1,
          points: 10,
          laps: 57,
          winner: {
            driverId: 'fisichella',
            fullName: 'Fisichella',
            nationality: 'Italian',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Albert Park Grand Prix Circuit',
            location: {
              locality: 'Melbourne',
              country: 'Australia',
            },
          },
        },
        {
          name: 'Malaysian Grand Prix',
          round: 2,
          points: 10,
          laps: 56,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Sepang International Circuit',
            location: {
              locality: 'Kuala Lumpur',
              country: 'Malaysia',
            },
          },
        },
        {
          name: 'Bahrain Grand Prix',
          round: 3,
          points: 10,
          laps: 57,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Bahrain International Circuit',
            location: {
              locality: 'Sakhir',
              country: 'Bahrain',
            },
          },
        },
        {
          name: 'San Marino Grand Prix',
          round: 4,
          points: 10,
          laps: 62,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Autodromo Enzo e Dino Ferrari',
            location: {
              locality: 'Imola',
              country: 'Italy',
            },
          },
        },
        {
          name: 'Spanish Grand Prix',
          round: 5,
          points: 10,
          laps: 66,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Circuit de Barcelona-Catalunya',
            location: {
              locality: 'Montmeló',
              country: 'Spain',
            },
          },
        },
        {
          name: 'Monaco Grand Prix',
          round: 6,
          points: 10,
          laps: 78,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Circuit de Monaco',
            location: {
              locality: 'Monte-Carlo',
              country: 'Monaco',
            },
          },
        },
        {
          name: 'European Grand Prix',
          round: 7,
          points: 10,
          laps: 59,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Nürburgring',
            location: {
              locality: 'Nürburg',
              country: 'Germany',
            },
          },
        },
        {
          name: 'Canadian Grand Prix',
          round: 8,
          points: 10,
          laps: 70,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Circuit Gilles Villeneuve',
            location: {
              locality: 'Montreal',
              country: 'Canada',
            },
          },
        },
        {
          name: 'United States Grand Prix',
          round: 9,
          points: 10,
          laps: 73,
          winner: {
            driverId: 'michael_schumacher',
            fullName: 'Schumacher',
            nationality: 'German',
          },
          winnerConstructor: {
            name: 'Ferrari',
            nationality: 'Italian',
          },
          circuit: {
            circuitName: 'Indianapolis Motor Speedway',
            location: {
              locality: 'Indianapolis',
              country: 'USA',
            },
          },
        },
        {
          name: 'French Grand Prix',
          round: 10,
          points: 10,
          laps: 70,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Circuit de Nevers Magny-Cours',
            location: {
              locality: 'Magny Cours',
              country: 'France',
            },
          },
        },
        {
          name: 'British Grand Prix',
          round: 11,
          points: 10,
          laps: 60,
          winner: {
            driverId: 'montoya',
            fullName: 'Pablo Montoya',
            nationality: 'Colombian',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Silverstone Circuit',
            location: {
              locality: 'Silverstone',
              country: 'UK',
            },
          },
        },
        {
          name: 'German Grand Prix',
          round: 12,
          points: 10,
          laps: 67,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Hockenheimring',
            location: {
              locality: 'Hockenheim',
              country: 'Germany',
            },
          },
        },
        {
          name: 'Hungarian Grand Prix',
          round: 13,
          points: 10,
          laps: 70,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Hungaroring',
            location: {
              locality: 'Budapest',
              country: 'Hungary',
            },
          },
        },
        {
          name: 'Turkish Grand Prix',
          round: 14,
          points: 10,
          laps: 58,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Istanbul Park',
            location: {
              locality: 'Istanbul',
              country: 'Turkey',
            },
          },
        },
        {
          name: 'Italian Grand Prix',
          round: 15,
          points: 10,
          laps: 53,
          winner: {
            driverId: 'montoya',
            fullName: 'Pablo Montoya',
            nationality: 'Colombian',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Autodromo Nazionale di Monza',
            location: {
              locality: 'Monza',
              country: 'Italy',
            },
          },
        },
        {
          name: 'Belgian Grand Prix',
          round: 16,
          points: 10,
          laps: 44,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Circuit de Spa-Francorchamps',
            location: {
              locality: 'Spa',
              country: 'Belgium',
            },
          },
        },
        {
          name: 'Brazilian Grand Prix',
          round: 17,
          points: 10,
          laps: 71,
          winner: {
            driverId: 'montoya',
            fullName: 'Pablo Montoya',
            nationality: 'Colombian',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Autódromo José Carlos Pace',
            location: {
              locality: 'São Paulo',
              country: 'Brazil',
            },
          },
        },
        {
          name: 'Japanese Grand Prix',
          round: 18,
          points: 10,
          laps: 53,
          winner: {
            driverId: 'raikkonen',
            fullName: 'Räikkönen',
            nationality: 'Finnish',
          },
          winnerConstructor: {
            name: 'McLaren',
            nationality: 'British',
          },
          circuit: {
            circuitName: 'Suzuka Circuit',
            location: {
              locality: 'Suzuka',
              country: 'Japan',
            },
          },
        },
        {
          name: 'Chinese Grand Prix',
          round: 19,
          points: 10,
          laps: 56,
          winner: {
            driverId: 'alonso',
            fullName: 'Alonso',
            nationality: 'Spanish',
          },
          winnerConstructor: {
            name: 'Renault',
            nationality: 'French',
          },
          circuit: {
            circuitName: 'Shanghai International Circuit',
            location: {
              locality: 'Shanghai',
              country: 'China',
            },
          },
        },
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const params = {
      params: new Promise<{
        seasonYear: string;
      }>((resolve) => resolve({ seasonYear: '2005' })),
    };

    const { baseElement } = render(await SeasonResult(params));
    expect(baseElement).toBeTruthy();

    expect(
      screen.getByText(`${mockData.year} Season Results`)
    ).toBeInTheDocument();

    const rows = screen.getAllByTestId('race-row');
    expect(rows.length).toEqual(mockData.races.length);

    for (const race of mockData.races) {
      const index = mockData.races.indexOf(race);
      const columns = within(rows[index]).getAllByRole('cell');

      expect(columns.length).toEqual(7);

      expect(within(columns[0]).getByText(race.round.toString())).toBeInTheDocument();
      expect(within(columns[1]).getByText(race.name)).toBeInTheDocument();
      expect(within(columns[2]).getByText(race.circuit.circuitName)).toBeInTheDocument();
      expect(within(columns[3]).getByText(`${race.circuit.location.locality}, ${race.circuit.location.country}`)).toBeInTheDocument();
      expect(within(columns[4]).getByText(`${race.winner.fullName}, ${race.winnerConstructor.name}`)).toBeInTheDocument();
      expect(within(columns[5]).getByText(race.points.toString())).toBeInTheDocument();
      expect(within(columns[6]).getByText(race.laps.toString())).toBeInTheDocument();
    }
  });
});
