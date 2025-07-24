import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { PolicialCard } from '../policial-card/policial-card';
import { AuthService } from '../../services/auth';
import { EfetivoService } from '../../services/efetivo';
import { Policial } from '../../models/interfaces';

@Component({
  selector: 'app-efetivo',
  imports: [CommonModule, Navbar, PolicialCard],
  templateUrl: './efetivo.html',
  styleUrl: './efetivo.scss'
})
export class Efetivo implements OnInit {
  policiais: Policial[] = [];
  secoesFiltro: string[] = [];
  secaoSelecionada = 'todas';
  policiaisFiltrados: Policial[] = [];

  // Modal
  policialSelecionado: Policial | null = null;
  modalAberto = false;

  constructor(
    private authService: AuthService,
    private efetivoService: EfetivoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  private loadData(): void {
    this.efetivoService.getPoliciais().subscribe(policiais => {
      this.policiais = policiais;
      this.policiaisFiltrados = policiais;

      // Extrair seções únicas
      this.secoesFiltro = [...new Set(policiais.map(p => p.secao))];
    });
  }

  filtrarPorSecao(secao: string): void {
    this.secaoSelecionada = secao;
    if (secao === 'todas') {
      this.policiaisFiltrados = this.policiais;
    } else {
      this.policiaisFiltrados = this.policiais.filter(p => p.secao === secao);
    }
  }

  abrirModalPolicial(policial: Policial): void {
    this.policialSelecionado = policial;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.policialSelecionado = null;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/cadastro-efetivo']);
  }
}
