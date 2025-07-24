import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrompt } from './admin-prompt';

describe('AdminPrompt', () => {
  let component: AdminPrompt;
  let fixture: ComponentFixture<AdminPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
