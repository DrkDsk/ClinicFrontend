import {TypeAppointment} from './type.appointment';
import {Patient} from './patient';
import {Doctor} from './doctor';

export interface Appointment {
  id: number
  scheduled_at: string
  time: string
  doctor: Doctor
  patient: Patient
  typeAppointment: TypeAppointment
}
