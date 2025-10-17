import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '💇‍♀️',
      title: 'Estilistas Profesionales',
      description: 'Personal capacitado con años de experiencia en tendencias actuales y técnicas especializadas'
    },
    {
      icon: '⏰',
      title: 'Reserva Online 24/7',
      description: 'Agenda tu cita cualquier día, a cualquier hora, desde tu celular o computadora'
    },
    {
      icon: '✨',
      title: 'Productos Premium',
      description: 'Usamos solo productos de las mejores marcas para cuidar y embellecer tu cabello'
    },
    {
      icon: '💇‍♀️ 💆‍♂️',
      title: 'Ambiente Relajante',
      description: 'Disfruta de un espacio cómodo y moderno mientras te consientes y renuevas tu estilo'
    }
  ];
}
