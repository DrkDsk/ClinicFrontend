import {Observable} from 'rxjs';
import {AvailableAppointmentsResponseModel} from '../models/available.appoinments.response.model';
import {AppointmentDataResponseModel} from '../../../users/profile/data/models/appointments.data.response.model';

export interface AppointmentApiService {
  getAvailableDates(doctor: string, date: string): Observable<AvailableAppointmentsResponseModel>

  getPaginatedAppointments(page: number, perPage: number): Observable<AppointmentDataResponseModel>
}
