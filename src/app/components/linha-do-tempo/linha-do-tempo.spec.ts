import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhaDoTempo } from './linha-do-tempo';

describe('LinhaDoTempo', () => {
  let component: LinhaDoTempo;
  let fixture: ComponentFixture<LinhaDoTempo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinhaDoTempo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinhaDoTempo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
