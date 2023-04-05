import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";
import type { DriverListResponse } from "./driver-list.types";
import type { ErgastApiResponse } from "../ergast-api/ergast-api.types";

/**
 * API service for loading a list of F1 drivers.
 */
@Injectable()
export class DriverListApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    /**
     * Get the limit-length list of drivers for the passed season, starting at the offset index.
     */
    getDriverList(season: string, limit: number, offset: number): Observable<ErgastApiResponse<DriverListResponse>> {
        return this.httpClient.get<ErgastApiResponse<DriverListResponse>>(`http://ergast.com/api/f1/${season}/drivers.json?limit=${limit}&offset=${offset}`);
    }
}