import { MRData } from "../ergast-api/ergast-api.types";

/**
 * The driver data returned from the Ergast API.
 */
export interface Driver {
    dateOfBirth: string;
    permanentNumber: string;
    familyName: string;
    givenName: string;
    nationality: string;
}

/**
 * The response from the Ergast API when querying for driver list data.
 */
export interface DriverListResponse extends MRData {
    DriverTable: {
        Drivers: Driver[];
    };
}