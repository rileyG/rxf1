import { fakeAsync, flush } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { DriverListApiService } from './driver-list-api.service';
import { DriverListComponentStore } from './driver-list.component.store';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, throwError } from 'rxjs';
import { Driver } from './driver-list.types';

describe('DriverListComponentStore', () => {
  let spectator: SpectatorService<DriverListComponentStore>;
  let service: DriverListComponentStore;
  const createService = createServiceFactory({
    service: DriverListComponentStore,
    mocks: [DriverListApiService]
  });

  let driverListApiService: SpyObject<DriverListApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    driverListApiService = spectator.inject(DriverListApiService);
  });

  describe('loadData', () => {
    it('should update the state with new data if the API call is successful', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);
      const totalSpy = subscribeSpyTo(service.total$);

      const expectedDrivers: Driver[] = [
        {
          dateOfBirth: '01-01-2021',
          familyName: 'Wayne',
          givenName: 'Bruce',
          nationality: 'Gotham',
          permanentNumber: '1',
        },
        {
          dateOfBirth: '01-01-2021',
          familyName: 'Kent',
          givenName: 'Clark',
          nationality: 'Metropolis',
          permanentNumber: '1',
        },
        {
          dateOfBirth: '01-01-2021',
          familyName: 'Prince',
          givenName: 'Diana',
          nationality: 'Paradise Island',
          permanentNumber: '1',
        },
      ]
      driverListApiService.getDriverList.and.returnValue(of(expectedDrivers));

      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[], expectedDrivers]);
      expect(errorSpy.getValues()).toEqual([null]);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
      expect(totalSpy.getLastValue).toEqual(15);
    }));

    it('should update the state with an error returned from an unsuccessful API call', fakeAsync(() => {
      const dataSpy = subscribeSpyTo(service.data$);
      const errorSpy = subscribeSpyTo(service.error$);
      const loadingSpy = subscribeSpyTo(service.loading$);

      driverListApiService.getDriverList.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

      service.connect();
      flush();

      expect(dataSpy.getValues()).toEqual([[]]);
      expect(errorSpy.getValues()).toEqual([null, 'Come up with a more interesting error message.']);
      expect(loadingSpy.getValues()).toEqual([false, true, false]);
    }))
  })
});
