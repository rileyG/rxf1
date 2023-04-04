import { MRData } from "../ergast-api/ergast-api.types";

export interface Driver {
    dateOfBirth: string;
    permanentNumber: string;
    familyName: string;
    givenName: string;
    nationality: string;
}

export interface DriverListResponse extends MRData {
    DriverTable: {
        Drivers: Driver[];
    };
}