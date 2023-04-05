import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, throwError } from 'rxjs';
import { RaceDetailsApiService } from '../race-details-api.service';
import { QualifyingResult } from '../race-details.types';
import { QualifyingResultsComponentStore } from './qualifying-results.component.store';

describe('QualifyingResultsComponentStore', () => {
  let spectator: SpectatorService<QualifyingResultsComponentStore>;
  let service: QualifyingResultsComponentStore;
  const createService = createServiceFactory({
    service: QualifyingResultsComponentStore,
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

      const expectedQualifiers: QualifyingResult[] = [
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Wayne',
            givenName: 'Bruce',
            nationality: 'Gotham',
            permanentNumber: '1',
          },
          number: '1',
          position: '1',
          Q1: '1:00:00',
          Q2: '1:00:00',
          Q3: '1:00:00',
        },
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Kent',
            givenName: 'Clark',
            nationality: 'Metropolis',
            permanentNumber: '1',
          },
          number: '45',
          position: '2',
          Q1: '1:00:00',
          Q2: '1:00:00',
          Q3: '1:00:00',
        },
        {
          Driver: {
            dateOfBirth: '01-01-2021',
            familyName: 'Prince',
            givenName: 'Diana',
            nationality: 'Paradise Island',
            permanentNumber: '1',
          },
          number: '40',
          position: '3',
          Q1: '1:00:00',
          Q2: '1:00:00',
          Q3: '1:00:00',
        },
      ]
      raceDetailsApiService.getRaceQualifyingResults.and.returnValue(of({
        MRData: {
          RaceTable: {
            Races: [{
              QualifyingResults: expectedQualifiers,
            }]
          },
          total: '15'
        }
      }));

      service.setRound('1');
      service.setSeason('2018');
      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[], expectedQualifiers]);
      expect(errorSpy.getValues()).toEqual([null]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(totalSpy.getLastValue()).toEqual(15);
    }));

    it('should update the state with an error returned from an unsuccessful API call', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);

      raceDetailsApiService.getRaceQualifyingResults.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

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

