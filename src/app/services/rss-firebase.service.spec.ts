import { TestBed } from '@angular/core/testing';

import { RssFirebaseService } from './rss-firebase.service';

describe('RssFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RssFirebaseService = TestBed.get(RssFirebaseService);
    expect(service).toBeTruthy();
  });
});
