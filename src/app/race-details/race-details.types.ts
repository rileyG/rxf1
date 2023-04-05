import { Driver } from "../driver-list/driver-list.types";
import { MRData } from "../ergast-api/ergast-api.types";
import { Race } from "../race-list/race-list.types";

/**
 * The response from the basic race details API call.
 */
export interface RaceDetailsResponse extends MRData {
    RaceTable: {
        Races: Race[];
    }
}

/**
 * A driver standing returned from the API.
 */
export interface DriverStanding {
    Driver: Driver;
    points: string;
    position: string;
}

/**
 * The response from the driver standings API call.
 */
export interface DriverStandingsResponse extends MRData {
    StandingsTable: {
        StandingsLists: {
            DriverStandings: DriverStanding[];
        }[];
    };
}

/**
 * A driver result for a given race.
 */
export interface RaceResult {
    Driver: Driver;
    number: string;
    position: string;
}

/**
 * A race with all associated driver results.
 */
export interface RaceWithResults extends Race {
    Results: RaceResult[];
}

/**
 * The response from a race results API call.
 */
export interface RaceResultsResponse extends MRData {
    RaceTable: {
        Races: RaceWithResults[];
    }
}

/**
 * The qualfiying result for a driver in a race.
 */
export interface QualifyingResult {
    Driver: Driver;
    number: string;
    position: string;
    Q1: string;
    Q2: string;
    Q3: string;
}

/**
 * A race with its associated qualifying results.
 */
export interface RaceWithQualifyingResults extends Race {
    QualifyingResults: QualifyingResult[];
}

/**
 * The response from the qualifying results API call.
 */
export interface QualifyingResultsResponse extends MRData {
    RaceTable: {
        Races: RaceWithQualifyingResults[]
    }
}

/**
 * A finishing status that could be associated with a race.
 */
export interface Status {
    count: string;
    status: string;
}

/**
 * The response from the finshing status API call.
 */
export interface FinishingStatusResponse extends MRData {
    StatusTable: {
        Status: Status[];
    }
}