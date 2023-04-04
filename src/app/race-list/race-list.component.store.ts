import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import { ErgastApiResponse, ErgastApiVariables } from "../ergast-api/ergast-api.types";
import { RaceListApiService } from "./race-list-api.service";
import { Race, RaceListResponse } from "./race-list.types";

@Injectable()
export class RaceListComponentStore extends ErgastApiComponentStore<Race, ErgastApiVariables, RaceListResponse> {
    // region Dependency Injections

    private readonly raceListApiService = inject(RaceListApiService);

    // endregion Dependency Injections

    constructor() {
        super();
    }

    // region Read

    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.season$,
        (limit, offset, season) => ({ limit, offset, season }),
    );

    // endregion Read

    protected override getApiQuery({ season, limit, offset }: ErgastApiVariables): Observable<ErgastApiResponse<RaceListResponse>> {
        return this.raceListApiService.getRaceList(season, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<RaceListResponse>): Race[] {
        console.log(response.MRData.RaceTable.Races);
        return response.MRData.RaceTable.Races;
    }
}