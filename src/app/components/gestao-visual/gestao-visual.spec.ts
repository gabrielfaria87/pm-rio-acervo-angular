import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoVisual } from './gestao-visual';

describe('GestaoVisual', () => {
  let component: GestaoVisual;
  let fixture: ComponentFixture<GestaoVisual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoVisual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestaoVisual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
