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
    const en30Dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const fechaInicio = hace30Dias.toISOString().split('T')[0];
    const fechaFin = en30Dias.toISOString().split('T')[0];

    console.log('Cargando estadísticas desde:', fechaInicio, 'hasta:', fechaFin);

    this.reservaService.obtenerEstadisticas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        console.log('Estadísticas recibidas:', data);
        this.estadisticas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        console.error('Detalles del error:', err.error);
        this.loading = false;
        
        // Mostrar estadísticas por defecto en caso de error
        this.estadisticas = {
          total_reservas: 0,
          completadas: 0,
          canceladas: 0,
          pendientes: 0
        };
      }
    });
  }

  cargarEstadisticas90Dias() {
    const hoy = new Date();
    const hace90Dias = new Date(hoy.getTime() - 90 * 24 * 60 * 60 * 1000);
    const en90Dias = new Date(hoy.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const fechaInicio = hace90Dias.toISOString().split('T')[0];
    const fechaFin = en90Dias.toISOString().split('T')[0];

    console.log('Cargando estadísticas de 90 días desde:', fechaInicio, 'hasta:', fechaFin);

    this.loading = true;
    this.reservaService.obtenerEstadisticas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        console.log('Estadísticas de 90 días recibidas:', data);
        this.estadisticas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de 90 días:', err);
        this.loading = false;
      }
    });
  }

  cargarTodasLasReservas() {
    console.log('Cargando TODAS las reservas sin filtro de fecha');

    this.loading = true;
    // Usar un rango muy amplio para capturar todas las reservas
    const fechaInicio = '2020-01-01';
    const fechaFin = '2030-12-31';

    this.reservaService.obtenerEstadisticas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        console.log('Todas las reservas recibidas:', data);
        this.estadisticas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar todas las reservas:', err);
        this.loading = false;
      }
    });
  }
}
