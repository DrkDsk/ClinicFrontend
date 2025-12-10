import {Observable} from 'rxjs';
import {AvailableAppointmentsResponseModel} from '../../data/models/available.appoinments.response.model';
import {AppointmentDataResponseModel} from '../../../users/profile/data/models/appointments.data.response.model';

export interface AppointmentRepository {
  getAvailableDates(doctor: string, date: string): Observable<AvailableAppointmentsResponseModel>

  paginateAppointments(page: number | null | undefined, perPage: number | null | undefined): Observable<AppointmentDataResponseModel>
}
