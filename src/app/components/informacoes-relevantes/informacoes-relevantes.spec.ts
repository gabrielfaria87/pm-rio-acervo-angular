import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesRelevantes } from './informacoes-relevantes';

describe('InformacoesRelevantes', () => {
  let component: InformacoesRelevantes;
  let fixture: ComponentFixture<InformacoesRelevantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacoesRelevantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacoesRelevantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
