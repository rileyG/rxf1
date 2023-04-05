import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ErgastApiResponse } from "../ergast-api/ergast-api.types";
import { DriverStandingsResponse, FinishingStatusResponse, QualifyingResultsResponse, RaceDetailsResponse, RaceResultsResponse } from "./race-details.types";

@Injectable()
export class RaceDetailsApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    private readonly apiBase = 'http://ergast.com/api/f1/';

    getRaceDetails(season: string, round: string): Observable<ErgastApiResponse<RaceDetailsResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceDetailsResponse>>(`${this.apiBase}${season}/${round}.json`);
    }

    getRaceDriverStandings(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<DriverStandingsResponse>> {
        return this.httpClient.get<ErgastApiResponse<DriverStandingsResponse>>(`${this.apiBase}${season}/${round}/driverStandings.json?limit=${limit}&offset=${offset}`);
    }

    getRaceFinishingStatus(season: string, round: string): Observable<ErgastApiResponse<FinishingStatusResponse>> {
        return this.httpClient.get<ErgastApiResponse<FinishingStatusResponse>>(`${this.apiBase}${season}/${round}/status.json`);
    }

    getRaceQualifyingResults(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<QualifyingResultsResponse>> {
        return this.httpClient.get<ErgastApiResponse<QualifyingResultsResponse>>(`${this.apiBase}${season}/${round}/qualifying.json?limit=${limit}&offset=${offset}`)
    }

    getRaceResults(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<RaceResultsResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceResultsResponse>>(`${this.apiBase}${season}/${round}/results.json?limit=${limit}&offset=${offset}`);
    }
}