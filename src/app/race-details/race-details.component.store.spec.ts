import { fakeAsync, flush } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { subscribeSpyTo } from "@hirez_io/observer-spy";
import { createServiceFactory, SpectatorService, SpyObject } from "@ngneat/spectator"
import { of, throwError } from "rxjs";
import { RaceDetailsApiService } from "./race-details-api.service";
import { RaceDetailsComponentStore } from "./race-details.component.store"

describe('RaceDetailsComponentStore', () => {
    let spectator: SpectatorService<RaceDetailsComponentStore>;
    let service: RaceDetailsComponentStore;
    const createSpectatorService = createServiceFactory({
        service: RaceDetailsComponentStore,
        mocks: [RaceDetailsApiService],
        providers: [
            { provide: ActivatedRoute, useValue: { params: of({ round: '1', season: '2018' })}}
        ]
    });

    let raceDetailsApiService: SpyObject<RaceDetailsApiService>;

    beforeEach(() => {
        spectator = createSpectatorService();
        service = spectator.service;

        raceDetailsApiService = spectator.inject(RaceDetailsApiService);
    });

    describe('loadData', () => {
        it('should update the race details if the API call is successful', fakeAsync(() => {
            const errorSpy = subscribeSpyTo(service.error$);
            const loadingSpy = subscribeSpyTo(service.loading$);
            const detailsSpy = subscribeSpyTo(service.details$);

            const expectedRace = {
                Circuit: {
                    circuitName: 'Test Name',
                },
                date: '01-01-2021',
                raceName: 'Test Race',
                round: '1',
            };
            raceDetailsApiService.getRaceDetails.and.returnValue(of({
                MRData: {
                    RaceTable: {
                        Races: [expectedRace]
                    }
                }
            }))

            service.ngrxOnStateInit();
            flush();

            expect(errorSpy.getValues()).toEqual([null]);
            expect(loadingSpy.getValues()).toEqual([false, true, false]);
            expect(detailsSpy.getLastValue()).toEqual(expectedRace);
        }));

        it('should capture an error if the API call fails', fakeAsync(() => {
            const errorSpy = subscribeSpyTo(service.error$);
            const loadingSpy = subscribeSpyTo(service.loading$);

            raceDetailsApiService.getRaceDetails.and.returnValue(throwError(() => new Error('Come up with a more interesting error message.')));

            service.ngrxOnStateInit();
            flush();

            expect(errorSpy.getLastValue()).toEqual('Come up with a more interesting error message.');
            expect(loadingSpy.getValues()).toEqual([false, true, false]);
        }))
    })
})