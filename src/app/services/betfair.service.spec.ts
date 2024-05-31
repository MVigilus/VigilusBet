import { TestBed } from '@angular/core/testing';

import { BetfairService } from './betfair.service';

describe('BetfairService', () => {
  let service: BetfairService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetfairService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
