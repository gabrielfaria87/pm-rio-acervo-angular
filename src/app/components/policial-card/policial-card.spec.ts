import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicialCard } from './policial-card';

describe('PolicialCard', () => {
  let component: PolicialCard;
  let fixture: ComponentFixture<PolicialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicialCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicialCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
