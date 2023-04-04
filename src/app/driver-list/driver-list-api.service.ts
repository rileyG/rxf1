import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { DriverListResponse } from "./driver-list.types";
import { ErgastApiResponse } from "../ergast-api/ergast-api.types";

@Injectable()
export class DriverListApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    getDriverList(season: string, limit: number, offset: number): Observable<ErgastApiResponse<DriverListResponse>> {
        return this.httpClient.get<ErgastApiResponse<DriverListResponse>>(`http://ergast.com/api/f1/${season}/drivers.json?limit=${limit}&offset=${offset}`);
    }
}