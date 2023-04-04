import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ErgastApiResponse } from "../ergast-api/ergast-api.types";
import { RaceListResponse } from "./race-list.types";

@Injectable()
export class RaceListApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    getRaceList(season: string, limit: number, offset: number): Observable<ErgastApiResponse<RaceListResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceListResponse>>(`http://ergast.com/api/f1/${season}/races.json?limit=${limit}&offset=${offset}`);
    }
}