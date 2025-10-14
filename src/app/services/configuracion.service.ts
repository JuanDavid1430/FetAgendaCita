import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { horarios_trabajo, DiaBloqueado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private apiUrl = 'http://localhost:3000/api/configuracion';

  constructor(private http: HttpClient) { }

  // Horarios de trabajo
  listarHorarios(): Observable<horarios_trabajo[]> {
    return this.http.get<horarios_trabajo[]>(`${this.apiUrl}/horarios`);
  }

  actualizarHorario(diaSemana: number, horario: Partial<horarios_trabajo>): Observable<any> {
    return this.http.put(`${this.apiUrl}/horarios/${diaSemana}`, horario);
  }

  // Días bloqueados
  listarDiasBloqueados(): Observable<DiaBloqueado[]> {
    return this.http.get<DiaBloqueado[]>(`${this.apiUrl}/dias-bloqueados`);
  }

  crearDiaBloqueado(dia: DiaBloqueado): Observable<any> {
    return this.http.post(`${this.apiUrl}/dias-bloqueados`, dia);
  }

  eliminarDiaBloqueado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dias-bloqueados/${id}`);
  }
}
