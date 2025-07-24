import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sobre',
  imports: [CommonModule, Navbar],
  templateUrl: './sobre.html',
  styleUrl: './sobre.scss'
})
export class Sobre implements OnInit {
  currentSlide = 0;

  // Dados do carrossel
  carrosselImagens = [
    {
      src: 'assets/images/arquivo-historico-1.jpg',
      alt: 'História do Arquivo Geral - Fundação',
      titulo: 'Fundação do Arquivo'
    },
    {
      src: 'assets/images/arquivo-historico-2.jpg',
      alt: 'História do Arquivo Geral - Desenvolvimento',
      titulo: 'Desenvolvimento'
    },
    {
      src: 'assets/images/arquivo-historico-3.jpg',
      alt: 'História do Arquivo Geral - Modernização',
      titulo: 'Modernização'
    },
    {
      src: 'assets/images/arquivo-historico-4.jpg',
      alt: 'História do Arquivo Geral - Tecnologia',
      titulo: 'Era Digital'
    },
    {
      src: 'assets/images/arquivo-historico-5.jpg',
      alt: 'História do Arquivo Geral - Futuro',
      titulo: 'Futuro'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Auto-play do carrossel
    this.startCarousel();
  }

  private startCarousel(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Troca a cada 5 segundos
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carrosselImagens.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.carrosselImagens.length - 1
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
