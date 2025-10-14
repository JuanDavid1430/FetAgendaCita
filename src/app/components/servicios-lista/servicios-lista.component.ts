import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/interfaces';

@Component({
  selector: 'app-servicios-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-lista.component.html',
  styleUrls: ['./servicios-lista.component.css']
})
export class ServiciosListaComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = true;
  error = '';

  constructor(private servicioService: ServicioService) {}

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.servicioService.listarActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los servicios';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
