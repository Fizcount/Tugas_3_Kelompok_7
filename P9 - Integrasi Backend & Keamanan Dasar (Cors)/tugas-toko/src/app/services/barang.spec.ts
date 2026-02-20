import { TestBed } from '@angular/core/testing';

import { Barang } from './barang.service';

describe('Barang', () => {
  let service: Barang;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Barang);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
