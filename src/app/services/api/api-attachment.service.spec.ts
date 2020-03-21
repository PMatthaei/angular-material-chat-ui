import { TestBed } from '@angular/core/testing';

import { ApiAttachmentService } from './api-attachment.service';

describe('ApiAttachmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiAttachmentService = TestBed.get(ApiAttachmentService);
    expect(service).toBeTruthy();
  });
});
