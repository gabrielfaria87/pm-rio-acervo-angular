import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secoes } from './secoes';

describe('Secoes', () => {
  let component: Secoes;
  let fixture: ComponentFixture<Secoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
