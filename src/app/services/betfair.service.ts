import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BetfairService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matches`);
  }

  placeBet(marketId: string, selectionId: number, stake: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bet`, { marketId, selectionId, stake });
  }
}
