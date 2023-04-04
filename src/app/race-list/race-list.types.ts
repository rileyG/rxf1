import { Driver } from '../driver-list/driver-list.types';
import { MRData } from '../ergast-api/ergast-api.types';

export interface Circuit {
    circuitName: string;
}

export interface RaceResult {
    number: string;
    position: string;
    Driver: Driver;
}

export interface Race {
    Circuit: Circuit;
    date: string;
    raceName: string;
    round: string;
}

export interface RaceListResponse extends MRData {
    RaceTable: {
        Races: Race[];
    }
}