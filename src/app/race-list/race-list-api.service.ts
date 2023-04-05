import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import type { ErgastApiResponse } from "../ergast-api/ergast-api.types";
import type { RaceListResponse } from "./race-list.types";

/**
 * API service for loading paginated race lists.
 */
@Injectable()
export class RaceListApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    /**
     * Load the page of races for the passed season.
     */
    getRaceList(season: string, limit: number, offset: number): Observable<ErgastApiResponse<RaceListResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceListResponse>>(`http://ergast.com/api/f1/${season}/races.json?limit=${limit}&offset=${offset}`);
    }
}