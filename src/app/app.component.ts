import {Component, OnDestroy, OnInit} from '@angular/core';
import {Event, NavigationEnd, NavigationStart, Router, RouterModule, RouterOutlet} from '@angular/router';
import {BetfairService} from "./services/betfair.service";
import {Subscription} from "rxjs";
import {PageLoaderComponent} from "./layout/page-loader/page-loader.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageLoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'VigilusBet';
  currentUrl!: string;
  constructor(public _router: Router) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }

}
