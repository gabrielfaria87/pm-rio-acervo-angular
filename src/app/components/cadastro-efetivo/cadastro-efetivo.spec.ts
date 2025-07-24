import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEfetivo } from './cadastro-efetivo';

describe('CadastroEfetivo', () => {
  let component: CadastroEfetivo;
  let fixture: ComponentFixture<CadastroEfetivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEfetivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEfetivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
