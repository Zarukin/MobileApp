import { Injectable } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { filter, pairwise } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class RoutingService {
  private previousUrl: string;

  constructor(private router: Router) {}

  public subscribeRoute() {
    this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.previousUrl = e[0].urlAfterRedirects; // previous url
      });
  }

  public getPreviousRoute(): string {
    return this.previousUrl;
  }
}
