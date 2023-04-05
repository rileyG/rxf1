import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, throwError } from 'rxjs';
import { RaceDetailsApiService } from '../race-details-api.service';
import { FinishingStatusComponentStore } from './finishing-status.component.store';
import { Status } from '../race-details.types';

describe('FinishingStatusComponentStore', () => {
  let spectator: SpectatorService<FinishingStatusComponentStore>;
  let service: FinishingStatusComponentStore;
  const createService = createServiceFactory({
    service: FinishingStatusComponentStore,
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
      const accidentSpy = subscribeSpyTo(service.accident$);
      const errorSpy = subscribeSpyTo(service.error$);
      const finishedSpy = subscribeSpyTo(service.finished$);
      const loadingSpy = subscribeSpyTo(service.loading$);
      const plusOneLapSpy = subscribeSpyTo(service.plusOneLap$);

      const expectedStatuses: Status[] = [
        { status: 'Finished', count: '17' },
        { status: 'Accident', count: '3' },
        { status: 'Collision', count: '1' },
      ];
      raceDetailsApiService.getRaceFinishingStatus.and.returnValue(of({
        MRData: {
          StatusTable: {
            Status: expectedStatuses
          }
        }
      }));

      service.setRound('1');
      service.setSeason('2018');
      service.ngrxOnStateInit();
      flush();

      expect(accidentSpy.getValues()).toEqual([null, 3]);
      expect(errorSpy.getValues()).toEqual([null]);
      expect(finishedSpy.getValues()).toEqual([null, 17]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(plusOneLapSpy.getValues()).toEqual([null, 0])
    }));

    it('should update the state with an error returned from an unsuccessful API call', fakeAsync(() => {
      const accidentSpy = subscribeSpyTo(service.accident$);
      const errorSpy = subscribeSpyTo(service.error$);
      const finishedSpy = subscribeSpyTo(service.finished$);
      const loadingSpy = subscribeSpyTo(service.loading$);
      const plusOneLapSpy = subscribeSpyTo(service.plusOneLap$);

      raceDetailsApiService.getRaceFinishingStatus.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

      service.setRound('1');
      service.setSeason('2018');
      service.ngrxOnStateInit();
      flush();

      expect(accidentSpy.getValues()).toEqual([null]);
      expect(errorSpy.getValues()).toEqual([null, 'Come up with a more interesting error message.']);
      expect(finishedSpy.getValues()).toEqual([null]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(plusOneLapSpy.getValues()).toEqual([null]);
    }))
  })
});


