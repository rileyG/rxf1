import { ActivatedRouteSnapshot, createUrlTreeFromSnapshot, UrlTree } from "@angular/router";

/**
 * Can activate function to ensure that both a round and a season are present to load race details.
 */
export function canActivateRaceDetails(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return !!route.params['season'] && !!route.params['round'] ? true : createUrlTreeFromSnapshot(route, ['/races']);
}