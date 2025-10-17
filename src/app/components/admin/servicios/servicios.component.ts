import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';
import { Servicio } from '../../../models/interfaces';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  error = '';
  
  // Modal de edición/creación
  showModal = false;
  editingServicio: Servicio | null = null;
  isEditing = false;
  
  // Formulario
  servicioForm = {
    nombre: '',
    descripcion: '',
    duracion: 30,
    precio: 0,
    activo: true
  };

  constructor(private servicioService: ServicioService) {}

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.loading = true;
    this.error = '';
    
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = 'Error al cargar los servicios';
        this.loading = false;
      }
    });
  }

  abrirModalCrear() {
    this.isEditing = false;
    this.editingServicio = null;
    this.resetForm();
    this.showModal = true;
  }

  abrirModalEditar(servicio: Servicio) {
    this.isEditing = true;
    this.editingServicio = servicio;
    this.servicioForm = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      duracion: servicio.duracion,
      precio: servicio.precio || 0,
      activo: servicio.activo || true
    };
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.servicioForm = {
      nombre: '',
      descripcion: '',
      duracion: 30,
      precio: 0,
      activo: true
    };
  }

  onSubmit() {
    if (!this.servicioForm.nombre || !this.servicioForm.duracion) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (this.isEditing && this.editingServicio) {
      this.actualizarServicio();
    } else {
      this.crearServicio();
    }
  }

  crearServicio() {
    this.servicioService.crear(this.servicioForm).subscribe({
      next: () => {
        this.cargarServicios();
        this.cerrarModal();
        alert('Servicio creado exitosamente');
      },
      error: (err) => {
        console.error('Error al crear servicio:', err);
        alert('Error al crear el servicio');
      }
    });
  }

  actualizarServicio() {
    if (!this.editingServicio?.id) return;

    this.servicioService.actualizar(this.editingServicio.id, this.servicioForm).subscribe({
      next: () => {
        this.cargarServicios();
        this.cerrarModal();
        alert('Servicio actualizado exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar servicio:', err);
        alert('Error al actualizar el servicio');
      }
    });
  }

  eliminarServicio(servicio: Servicio) {
    if (!confirm(`¿Estás seguro de eliminar el servicio "${servicio.nombre}"?`)) {
      return;
    }

    this.servicioService.eliminar(servicio.id!).subscribe({
      next: () => {
        this.cargarServicios();
        alert('Servicio eliminado exitosamente');
      },
      error: (err) => {
        console.error('Error al eliminar servicio:', err);
        alert('Error al eliminar el servicio');
      }
    });
  }

  toggleActivo(servicio: Servicio) {
    const nuevoEstado = !servicio.activo;
    
    this.servicioService.actualizar(servicio.id!, { ...servicio, activo: nuevoEstado }).subscribe({
      next: () => {
        this.cargarServicios();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('Error al cambiar el estado del servicio');
      }
    });
  }

  obtenerClaseEstado(activo: boolean): string {
    return activo ? 'estado-activo' : 'estado-inactivo';
  }

  obtenerIconoEstado(activo: boolean): string {
    return activo ? '✅' : '❌';
  }

  obtenerServiciosActivos(): number {
    return this.servicios.filter(s => s.activo).length;
  }
}