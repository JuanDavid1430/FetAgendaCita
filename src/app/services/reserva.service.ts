import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva, ReservaFormData, Disponibilidad, DisponibilidadResponse, Estadisticas } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient) { }

  crear(reserva: ReservaFormData): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  listar(filtros?: any): Observable<Reserva[]> {
    let params = new HttpParams();
    
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.set(key, filtros[key]);
        }
      });
    }

    return this.http.get<Reserva[]>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  obtenerDisponibilidad(fecha: string, servicioId: number): Observable<DisponibilidadResponse> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('servicio_id', servicioId.toString());
    
    return this.http.get<DisponibilidadResponse>(`${this.apiUrl}/disponibilidad`, { params });
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }

  cancelar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, {});
  }

  obtenerEstadisticas(fechaInicio: string, fechaFin: string): Observable<Estadisticas> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    
    return this.http.get<Estadisticas>(`${this.apiUrl}/estadisticas`, { params });
  }
}
