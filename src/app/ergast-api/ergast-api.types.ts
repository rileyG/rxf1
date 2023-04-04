
/**
 * The base response data from the Ergast Developer API.
 */ 
 export interface MRData {
    total: string;
}

/**
 * The base API response type for a query to the Ergast Developer API.
 */
export interface ErgastApiResponse<T extends MRData> {
    MRData: T;
}

/**
 * The base variables required to select from the Ergast Developer API.
 */
export interface ErgastApiVariables {
    limit: number;
    offset: number;
    season: string;
}