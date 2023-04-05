import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { DriverListApiService } from "./driver-list-api.service";
import { Driver, DriverListResponse } from "./driver-list.types";
import { ErgastApiComponentStore } from "../ergast-api/ergast-api.component.store";
import { ErgastApiResponse, ErgastApiVariables } from "../ergast-api/ergast-api.types";

@Injectable()
export class DriverListComponentStore extends ErgastApiComponentStore<Driver, ErgastApiVariables, DriverListResponse, Record<string, never>> {
    // region Dependency Injections

    private readonly driverListApiService = inject(DriverListApiService);

    // endregion Dependency Injections

    constructor() {
        super({});
    }

    // region Read

    // region Composite Selectors

    protected override readonly apiVariables$ = this.select(
        this.limit$,
        this.offset$,
        this.season$,
        (limit, offset, season) => ({ limit, offset, season }),
    )

    // endregion Composite Selectors

    // endregion Read

    protected override getApiQuery({ season, limit, offset }: ErgastApiVariables): Observable<ErgastApiResponse<DriverListResponse>> {
        return this.driverListApiService.getDriverList(season, limit, offset);
    }

    protected override getDataFromApiResponse(response: ErgastApiResponse<DriverListResponse>): Driver[] {
        return response.MRData.DriverTable.Drivers;
    }
}