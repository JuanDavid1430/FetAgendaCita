import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { Estadisticas } from '../../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  estadisticas: Estadisticas = {
    total_reservas: 0,
    completadas: 0,
    canceladas: 0,
    pendientes: 0
  };
  loading = true;

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const fechaInicio = hace30Dias.toISOString().split('T')[0];
    const fechaFin = hoy.toISOString().split('T')[0];

    this.reservaService.obtenerEstadisticas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading = false;
      }
    });
  }
}
