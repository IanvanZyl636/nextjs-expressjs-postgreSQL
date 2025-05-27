export const seasonWithChampionAndConstructorQuery = {
  select: {
    year: true,
    champion: {
      select: {
        fullName: true,
        nationality: true,
      },
    },
    championConstructor: {
      select: {
        name: true,
        nationality: true,
      },
    },
  }
};

export const seasonWithRacesQuery = {
  select: {
    id: true,
    year: true,
    champion: {
      select: {
        driverId: true,
        fullName: true,
        nationality: true,
      },
    },
    championConstructor: {
      select: {
        name: true,
        nationality: true,
      },
    },
    races: {
      select: {
        name: true,
        round: true,
        points: true,
        laps: true,
        winner: {
          select: {
            driverId: true,
            fullName: true,
            nationality: true,
          },
        },
        winnerConstructor: {
          select: {
            name: true,
            nationality: true,
          },
        },
        circuit: {
          select: {
            circuitName: true,
            location: {
              select: {
                locality: true,
                country: true,
              },
            },
          },
        },
      },
    },
  },
};
