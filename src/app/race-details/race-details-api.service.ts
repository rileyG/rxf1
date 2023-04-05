import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import type { ErgastApiResponse } from "../ergast-api/ergast-api.types";
import type { DriverStandingsResponse, FinishingStatusResponse, QualifyingResultsResponse, RaceDetailsResponse, RaceResultsResponse } from "./race-details.types";

/**
 * API service for loading different portions of race details.
 */
@Injectable()
export class RaceDetailsApiService {
    // region Dependency Injections

    private readonly httpClient = inject(HttpClient);

    // endregion Dependency Injections

    private readonly apiBase = 'http://ergast.com/api/f1/';

    /**
     * Load the basic details for a given round in the passed season.
     */
    getRaceDetails(season: string, round: string): Observable<ErgastApiResponse<RaceDetailsResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceDetailsResponse>>(`${this.apiBase}${season}/${round}.json`);
    }

    /**
     * Load the driver standings as stand for after the given round in the passed season.
     */
    getRaceDriverStandings(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<DriverStandingsResponse>> {
        return this.httpClient.get<ErgastApiResponse<DriverStandingsResponse>>(`${this.apiBase}${season}/${round}/driverStandings.json?limit=${limit}&offset=${offset}`);
    }

    /**
     * Load the finishing status counts for a given round in the passed season.
     */
    getRaceFinishingStatus(season: string, round: string): Observable<ErgastApiResponse<FinishingStatusResponse>> {
        return this.httpClient.get<ErgastApiResponse<FinishingStatusResponse>>(`${this.apiBase}${season}/${round}/status.json`);
    }

    /**
     * Load the qualifying results for each driver for a given round in the passed season.
     */
    getRaceQualifyingResults(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<QualifyingResultsResponse>> {
        return this.httpClient.get<ErgastApiResponse<QualifyingResultsResponse>>(`${this.apiBase}${season}/${round}/qualifying.json?limit=${limit}&offset=${offset}`)
    }

    /**
     * Load the overall race results for a given round in the passed season.
     */
    getRaceResults(season: string, round: string, limit: number, offset: number): Observable<ErgastApiResponse<RaceResultsResponse>> {
        return this.httpClient.get<ErgastApiResponse<RaceResultsResponse>>(`${this.apiBase}${season}/${round}/results.json?limit=${limit}&offset=${offset}`);
    }
}