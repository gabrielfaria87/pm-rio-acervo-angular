import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Sobre } from './components/sobre/sobre';
import { Efetivo } from './components/efetivo/efetivo';
import { Secoes } from './components/secoes/secoes';
import { Acervo } from './components/acervo/acervo';
import { InformacoesRelevantes } from './components/informacoes-relevantes/informacoes-relevantes';
import { GestaoVisual } from './components/gestao-visual/gestao-visual';
import { CadastroEfetivo } from './components/cadastro-efetivo/cadastro-efetivo';
import { Dashboard } from './components/dashboard/dashboard';
import { Relatorios } from './components/relatorios/relatorios';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'sobre', component: Sobre },
  { path: 'efetivo', component: Efetivo },
  { path: 'secoes', component: Secoes },
  { path: 'acervo', component: Acervo },
  { path: 'informacoes', component: InformacoesRelevantes },
  { path: 'gestao', component: GestaoVisual },
  { path: 'cadastro-efetivo', component: CadastroEfetivo },
  { path: 'dashboard', component: Dashboard },
  { path: 'relatorios', component: Relatorios },
  { path: '**', redirectTo: '' }
];
