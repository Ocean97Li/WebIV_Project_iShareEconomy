import { TestBed, inject } from '@angular/core/testing';

import { MapSettingsService } from './map-settings.service';

describe('MapSettingsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapSettingsService]
    });
  });

  it('should be created', inject([MapSettingsService], (service: MapSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
