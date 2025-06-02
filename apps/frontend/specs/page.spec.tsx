import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
import Index from '../app/page';

describe('Page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    enableFetchMocks();
    fetchMock.doMock();
  });

  it('should render successfully', async () => {
    const mockData = [
      {
        "year": 2007,
        "champion": {
          "fullName": "Räikkönen",
          "nationality": "Finnish"
        },
        "championConstructor": {
          "name": "Ferrari",
          "nationality": "Italian"
        }
      },
      {
        "year": 2008,
        "champion": {
          "fullName": "Hamilton",
          "nationality": "British"
        },
        "championConstructor": {
          "name": "McLaren",
          "nationality": "British"
        }
      }
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const { baseElement } = render(await Index());
    expect(baseElement).toBeTruthy();

    for (const season of mockData) {
      expect(screen.getByText(season.year.toString())).toBeInTheDocument();
      expect(screen.getByText(season.champion.fullName)).toBeInTheDocument();
      expect(
        screen.getByText(`${season.champion.nationality}, ${season.championConstructor.name}`)
      ).toBeInTheDocument();
    }
  });
});
