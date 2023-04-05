import { MRData } from '../ergast-api/ergast-api.types';

/**
 * A circuit that a race is associated with.
 */
export interface Circuit {
    circuitName: string;
}

/**
 * The data for a race returned from the API call.
 */
export interface Race {
    Circuit: Circuit;
    date: string;
    raceName: string;
    round: string;
}

/**
 * The response type for an API call retrieving a race list.
 */
export interface RaceListResponse extends MRData {
    RaceTable: {
        Races: Race[];
    }
}