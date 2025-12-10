import {Component, inject, OnInit} from '@angular/core';
import {LargeButton} from '../../../../core/shared/presentation/buttons/large-button/large-button';
import {NavigationFacade} from '../../../../core/facade/navigation.facade';
import {AppPaths} from '../../../../core/constants/path.constants';
import {AppointmentRepository} from '../../domain/repositories/appointment.repository';
import {AppointmentRepositoryImpl} from '../../data/repositories/appointment.repository.impl';
import {Appointment} from '../../../users/doctor/domain/entities/appointment';
import {PaginatorMeta} from '../../../../core/shared/domain/entities/meta';
import {PaginatorService} from '../../../../core/shared/data/services/paginator/paginator.service';

@Component({
  selector: 'app-appointments.component',
  imports: [
    LargeButton
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {

  private navigationFacade = inject(NavigationFacade)
  private appointmentsRepository: AppointmentRepository = inject(AppointmentRepositoryImpl)
  private paginatorService = inject(PaginatorService)

  appointments: Appointment[] = []
  paginatorMeta!: PaginatorMeta;

  ngOnInit(): void {
    this.callToPaginatorService()
  }

  callToPaginatorService(page?: number, perPage?: number) {
    this.paginatorService.paginate<Appointment>(
      (page, perPage) => this.appointmentsRepository.paginateAppointments(page, perPage),
      page,
      perPage
    ).subscribe(response => {
      this.appointments = response.items

      const first = this.appointments[0]
      this.paginatorMeta = response.meta
    })
  }

  navigateToCreateAppointment() {
    this.navigationFacade.navigate(AppPaths.createAppointment)
  }

}
