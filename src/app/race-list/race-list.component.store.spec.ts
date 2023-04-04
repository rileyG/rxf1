import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, throwError } from 'rxjs';
import { RaceListComponentStore } from './race-list.component.store';
import { RaceListApiService } from './race-list-api.service';
import { Race } from './race-list.types';

describe('RaceListComponentStore', () => {
  let spectator: SpectatorService<RaceListComponentStore>;
  let service: RaceListComponentStore;
  const createService = createServiceFactory({
    service: RaceListComponentStore,
    mocks: [RaceListApiService]
  });

  let raceListApiService: SpyObject<RaceListApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    raceListApiService = spectator.inject(RaceListApiService);
  });

  describe('loadData', () => {
    it('should update the state with new data if the API call is successful', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);
      const totalSpy = subscribeSpyTo(service.total$);

      const expectedRaces: Race[] = [
        {
          date: '01-01-2021',
          round: '1',
          Circuit: {
            circuitName: 'Gotham City Circuit'
          },
          raceName: 'Gotham Grand Prix',
        },
        {
          date: '01-01-2021',
          round: '2',
          Circuit: {
            circuitName: 'Metropolis City Circuit'
          },
          raceName: 'Metropolis Grand Prix',
        },
        {
          date: '01-01-2021',
          round: '3',
          Circuit: {
            circuitName: 'Paradise Island Circuit'
          },
          raceName: 'Paradise Grand Prix',
        },
      ]
      raceListApiService.getRaceList.and.returnValue(of({
        MRData: {
          RaceTable: {
            Races: expectedRaces,
          },
          total: '15',
        }
      }));

      service.setSeason('2018');
      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[], expectedRaces]);
      expect(errorSpy.getValues()).toEqual([null]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(totalSpy.getLastValue()).toEqual(15);
    }));

    it('should update the state with an error returned from an unsuccessful API call', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);

      raceListApiService.getRaceList.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

      service.setSeason('2018');
      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[]]);
      expect(errorSpy.getValues()).toEqual([null, 'Come up with a more interesting error message.']);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
    }))
  })
});
