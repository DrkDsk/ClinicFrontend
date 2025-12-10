import {AppointmentRepository} from '../../domain/repositories/appointment.repository';
import {map, Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {AppointmentApiServiceImpl} from '../services/appointment.api.service.impl';
import {AppointmentApiService} from '../services/appointment.api.service';
import {AvailableAppointmentsResponseModel} from '../models/available.appoinments.response.model';
import {AppointmentDataResponseModel} from '../../../users/profile/data/models/appointments.data.response.model';

@Injectable({
  providedIn: 'root'
})

export class AppointmentRepositoryImpl implements AppointmentRepository {
  private appointmentApiService: AppointmentApiService = inject(AppointmentApiServiceImpl)

  paginateAppointments(page: number = 1, perPage: number = 10): Observable<AppointmentDataResponseModel> {
    page = page ?? 1;
    perPage = perPage ?? 10;

    const request = this.appointmentApiService.getPaginatedAppointments(page, perPage);

    return request.pipe(
      map(response => response)
    )
  }

  getAvailableDates(doctor: string, date: string): Observable<AvailableAppointmentsResponseModel> {
    const request = this.appointmentApiService.getAvailableDates(doctor, date);

    return request.pipe(
      map(response => response)
    )
  }
}
