import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/first';


export interface ICanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | boolean;
}




@Injectable()
export class CanDeactivateConfigGuard implements CanDeactivate<ICanComponentDeactivate> {
    canDeactivate(component: ICanComponentDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState): Observable<boolean> | boolean {
        // const canDeactv = component.canDeactivate();
        // if (typeof (canDeactv) === 'boolean') {
        //     return canDeactv;
        // } else {
        //     return canDeactv.first();
        // }

        return component.canDeactivate ? component.canDeactivate() : true;
    }
}
