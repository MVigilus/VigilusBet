import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "../../shared/components/breadcrumb/breadcrumb.component";
import {Subscription} from "rxjs";
import {BetfairService} from "../../services/betfair.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit,OnDestroy{
  matches: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(private betfairService: BetfairService) {}

  ngOnInit(): void {
    this.subscriptions.push(this.betfairService.getMatches().subscribe((data) => {
      this.matches = data;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  placeBet(marketId: string, selectionId: number): void {
    const stake = 10; // Esempio di importo della scommessa
    this.subscriptions.push(this.betfairService.placeBet(marketId, selectionId, stake).subscribe((response) => {
      console.log('Scommessa piazzata con successo:', response);
    }));
  }
}
