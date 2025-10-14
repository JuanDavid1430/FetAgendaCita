import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:3000/api/servicios';

  constructor(private http: HttpClient) { }

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  listarActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos`);
  }

  listar(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  crear(servicio: Servicio): Observable<any> {
    return this.http.post(this.apiUrl, servicio);
  }

  actualizar(id: number, servicio: Servicio): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, servicio);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
