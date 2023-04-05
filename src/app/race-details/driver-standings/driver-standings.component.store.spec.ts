import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, throwError } from 'rxjs';
import { DriverStandingsComponentStore } from './driver-standings.component.store';
import { RaceDetailsApiService } from '../race-details-api.service';
import { DriverStanding } from '../race-details.types';

describe('DriverStandingsComponentStore', () => {
  let spectator: SpectatorService<DriverStandingsComponentStore>;
  let service: DriverStandingsComponentStore;
  const createService = createServiceFactory({
    service: DriverStandingsComponentStore,
    mocks: [RaceDetailsApiService]
  });

  let raceDetailsApiService: SpyObject<RaceDetailsApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    raceDetailsApiService = spectator.inject(RaceDetailsApiService);
  });

  describe('loadData', () => {
    it('should update the state with new data if the API call is successful', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);
      const totalSpy = subscribeSpyTo(service.total$);

      const expectedDriverStandings: DriverStanding[] = [
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Wayne',
            givenName: 'Bruce',
            nationality: 'Gotham',
            permanentNumber: '1',
          },
          points: '50',
          position: '1'
        },
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Kent',
            givenName: 'Clark',
            nationality: 'Metropolis',
            permanentNumber: '1',
          },
          points: '45',
          position: '2'
        },
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Prince',
            givenName: 'Diana',
            nationality: 'Paradise Island',
            permanentNumber: '1',
          },
          points: '40',
          position: '3'
        },
      ]
      raceDetailsApiService.getRaceDriverStandings.and.returnValue(of({
        MRData: {
          StandingsTable: {
            StandingsLists: [{
              DriverStandings: expectedDriverStandings
            }]
          },
          total: '15'
        }
      }));

      service.setRound('1');
      service.setSeason('2018');
      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[], expectedDriverStandings]);
      expect(errorSpy.getValues()).toEqual([null]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(totalSpy.getLastValue()).toEqual(15);
    }));

    it('should update the state with an error returned from an unsuccessful API call', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);

      raceDetailsApiService.getRaceDriverStandings.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

      service.setRound('1');
      service.setSeason('2018');
      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[]]);
      expect(errorSpy.getValues()).toEqual([null, 'Come up with a more interesting error message.']);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
    }))
  })
});
