import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfiguracionService } from '../../../services/configuracion.service';
import { horarios_trabajo, DiaBloqueado } from '../../../models/interfaces';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  // Control de pestañas
  mostrarTab: 'horarios' | 'dias-bloqueados' = 'horarios';

  // Horarios de trabajo
  horarios: horarios_trabajo[] = [];
  loadingHorarios = false;
  errorHorarios = '';

  // Días bloqueados
  diasBloqueados: DiaBloqueado[] = [];
  loadingDias = false;
  errorDias = '';

  // Formulario de día bloqueado
  nuevoDiaBloqueado = {
    fecha: '',
    motivo: ''
  };

  // Días de la semana
  diasSemana = [
    { value: 0, nombre: 'Domingo' },
    { value: 1, nombre: 'Lunes' },
    { value: 2, nombre: 'Martes' },
    { value: 3, nombre: 'Miércoles' },
    { value: 4, nombre: 'Jueves' },
    { value: 5, nombre: 'Viernes' },
    { value: 6, nombre: 'Sábado' }
  ];

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit() {
    this.cargarHorarios();
    this.cargarDiasBloqueados();
  }

  cargarHorarios() {
    this.loadingHorarios = true;
    this.errorHorarios = '';

    this.configuracionService.listarHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
        this.loadingHorarios = false;
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.errorHorarios = 'Error al cargar horarios de trabajo';
        this.loadingHorarios = false;
      }
    });
  }

  cargarDiasBloqueados() {
    this.loadingDias = true;
    this.errorDias = '';

    this.configuracionService.listarDiasBloqueados().subscribe({
      next: (data) => {
        this.diasBloqueados = data;
        this.loadingDias = false;
      },
      error: (err) => {
        console.error('Error al cargar días bloqueados:', err);
        this.errorDias = 'Error al cargar días bloqueados';
        this.loadingDias = false;
      }
    });
  }

  actualizarHorario(diaSemana: number, horario: Partial<horarios_trabajo>) {
    // Buscar el horario existente para obtener hora_inicio y hora_fin
    const horarioExistente = this.horarios.find(h => h.dia_semana === diaSemana);
    
    if (!horarioExistente) {
      alert('No se encontró el horario para actualizar');
      return;
    }

    // Crear el objeto completo con los datos existentes y los nuevos
    const horarioCompleto = {
      hora_inicio: horario.hora_inicio || horarioExistente.hora_inicio,
      hora_fin: horario.hora_fin || horarioExistente.hora_fin,
      activo: horario.activo !== undefined ? horario.activo : horarioExistente.activo
    };

    this.configuracionService.actualizarHorario(diaSemana, horarioCompleto).subscribe({
      next: () => {
        this.cargarHorarios();
        alert('Horario actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar horario:', err);
        alert('Error al actualizar el horario');
      }
    });
  }

  agregarDiaBloqueado() {
    if (!this.nuevoDiaBloqueado.fecha || !this.nuevoDiaBloqueado.motivo) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.configuracionService.crearDiaBloqueado(this.nuevoDiaBloqueado).subscribe({
      next: () => {
        this.cargarDiasBloqueados();
        this.nuevoDiaBloqueado = { fecha: '', motivo: '' };
        alert('Día bloqueado agregado exitosamente');
      },
      error: (err) => {
        console.error('Error al agregar día bloqueado:', err);
        alert('Error al agregar el día bloqueado');
      }
    });
  }

  eliminarDiaBloqueado(id: number) {
    if (!confirm('¿Estás seguro de eliminar este día bloqueado?')) {
      return;
    }

    this.configuracionService.eliminarDiaBloqueado(id).subscribe({
      next: () => {
        this.cargarDiasBloqueados();
        alert('Día bloqueado eliminado exitosamente');
      },
      error: (err) => {
        console.error('Error al eliminar día bloqueado:', err);
        alert('Error al eliminar el día bloqueado');
      }
    });
  }

  obtenerNombreDia(diaSemana: number): string {
    const dia = this.diasSemana.find(d => d.value === diaSemana);
    return dia ? dia.nombre : 'Desconocido';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}