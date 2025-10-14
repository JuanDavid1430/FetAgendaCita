import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { ReservaService } from '../../services/reserva.service';
import { Servicio, DisponibilidadResponse } from '../../models/interfaces';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {
  reservaForm: FormGroup;
  servicios: Servicio[] = [];
  horariosDisponibles: string[] = [];
  loading = false;
  error = '';
  success = false;
  
  servicioSeleccionado?: Servicio;
  fechaSeleccionada = '';
  
  // Generar próximos 30 días
  diasDisponibles: Date[] = [];

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private reservaService: ReservaService,
    private router: Router
  ) {
    this.reservaForm = this.fb.group({
      servicio_id: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      nombre_cliente: ['', [Validators.required, Validators.minLength(3)]],
      email_cliente: ['', [Validators.required, Validators.email]],
      telefono_cliente: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      comentarios: ['']
    });
  }

  ngOnInit() {
    this.cargarServicios();
    this.generarDiasDisponibles();
    
    // Escuchar cambios en servicio y fecha
    this.reservaForm.get('servicio_id')?.valueChanges.subscribe(() => {
      this.onServicioChange();
    });
    
    this.reservaForm.get('fecha')?.valueChanges.subscribe(() => {
      this.verificarDisponibilidad();
    });
  }

  cargarServicios() {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => {
        this.servicios = data.filter(s => s.activo);
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.error = 'No se pudieron cargar los servicios';
      }
    });
  }

  generarDiasDisponibles() {
    const hoy = new Date();
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      // Excluir domingos (0 = domingo)
      if (fecha.getDay() !== 0) {
        this.diasDisponibles.push(fecha);
      }
    }
  }

  onServicioChange() {
    const servicioId = this.reservaForm.get('servicio_id')?.value;
    this.servicioSeleccionado = this.servicios.find(s => s.id === parseInt(servicioId));
    
    // Reset hora y horarios
    this.reservaForm.patchValue({ hora: '' });
    this.horariosDisponibles = [];
    
    // Verificar disponibilidad si ya hay fecha seleccionada
    if (this.reservaForm.get('fecha')?.value) {
      this.verificarDisponibilidad();
    }
  }

  verificarDisponibilidad() {
    const servicioId = this.reservaForm.get('servicio_id')?.value;
    const fecha = this.reservaForm.get('fecha')?.value;
    
    if (!servicioId || !fecha) return;
    
    this.loading = true;
    this.horariosDisponibles = [];
    this.reservaForm.patchValue({ hora: '' });
    
    this.reservaService.obtenerDisponibilidad(fecha, servicioId).subscribe({
      next: (response: DisponibilidadResponse) => {
        this.horariosDisponibles = response.horarios_disponibles || [];
        this.loading = false;
        
        if (this.horariosDisponibles.length === 0) {
          this.error = response.mensaje || 'No hay horarios disponibles para esta fecha';
        } else {
          this.error = '';
        }
      },
      error: (err) => {
        console.error('Error al verificar disponibilidad:', err);
        this.error = err.error?.mensaje || 'Error al verificar disponibilidad';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.reservaForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.error = '';
    
    const reservaData = {
      servicio_id: parseInt(this.reservaForm.value.servicio_id),
      fecha_hora: `${this.reservaForm.value.fecha} ${this.reservaForm.value.hora}`,
      nombre_cliente: this.reservaForm.value.nombre_cliente,
      email_cliente: this.reservaForm.value.email_cliente,
      telefono_cliente: this.reservaForm.value.telefono_cliente,
      comentarios: this.reservaForm.value.comentarios || null
    };

    this.reservaService.crearReserva(reservaData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
        this.error = err.error?.message || 'Error al crear la reserva';
        this.loading = false;
      }
    });
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  obtenerNombreDia(fecha: Date): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[fecha.getDay()];
  }

  obtenerNombreMes(fecha: Date): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[fecha.getMonth()];
  }
}
