import { Driver } from "../driver-list/driver-list.types";
import { MRData } from "../ergast-api/ergast-api.types";
import { Race } from "../race-list/race-list.types";

export interface RaceDetailsResponse extends MRData {
    RaceTable: {
        Races: Race[];
    }
}

export interface DriverStanding {
    Driver: Driver;
    points: string;
    position: string;
}

export interface DriverStandingsResponse extends MRData {
    StandingsTable: {
        StandingsLists: {
            DriverStandings: DriverStanding[];
        }[];
    };
}

export interface RaceResult {
    Driver: Driver;
    number: string;
    position: string;
}

export interface RaceWithResults extends Race {
    Results: RaceResult[];
}

export interface RaceResultsResponse extends MRData {
    RaceTable: {
        Races: RaceWithResults[];
    }
}

export interface QualifyingResult {
    Driver: Driver;
    number: string;
    position: string;
    Q1: string;
    Q2: string;
    Q3: string;
}

export interface RaceWithQualifyingResults extends Race {
    QualifyingResults: QualifyingResult[];
}

export interface QualifyingResultsResponse extends MRData {
    RaceTable: {
        Races: RaceWithQualifyingResults[]
    }
}

export interface Status {
    count: string;
    status: string;
}

export interface FinishingStatusResponse extends MRData {
    StatusTable: {
        Status: Status[];
    }
}