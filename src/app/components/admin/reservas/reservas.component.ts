import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/interfaces';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  loading = false;
  error = '';
  
  // Filtros
  filtroFecha = '';
  filtroEstado = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  
  // Estados disponibles
  estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.loading = true;
    this.error = '';
    
    const filtros: any = {};
    if (this.filtroFecha) filtros.fecha = this.filtroFecha;
    if (this.filtroEstado) filtros.estado = this.filtroEstado;
    if (this.filtroFechaDesde) filtros.fecha_desde = this.filtroFechaDesde;
    if (this.filtroFechaHasta) filtros.fecha_hasta = this.filtroFechaHasta;

    this.reservaService.listar(filtros).subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error = 'Error al cargar las reservas';
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    this.cargarReservas();
  }

  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroEstado = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.cargarReservas();
  }

  cambiarEstado(reserva: Reserva, nuevoEstado: string) {
    if (!confirm(`¿Estás seguro de cambiar el estado a "${nuevoEstado}"?`)) {
      return;
    }

    this.reservaService.actualizarEstado(reserva.id!, nuevoEstado).subscribe({
      next: () => {
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        alert('Error al actualizar el estado de la reserva');
      }
    });
  }

  cancelarReserva(reserva: Reserva) {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    this.reservaService.cancelar(reserva.id!).subscribe({
      next: () => {
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al cancelar reserva:', err);
        alert('Error al cancelar la reserva');
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'confirmada': return 'estado-confirmada';
      case 'completada': return 'estado-completada';
      case 'cancelada': return 'estado-cancelada';
      default: return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'confirmada': return '✅';
      case 'completada': return '🎉';
      case 'cancelada': return '❌';
      default: return '📋';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5);
  }
}