import { TestBed } from '@angular/core/testing';

import { Efetivo } from './efetivo';

describe('Efetivo', () => {
  let service: Efetivo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Efetivo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
