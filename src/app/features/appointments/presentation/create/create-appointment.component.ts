import {Component, inject, OnInit} from '@angular/core';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DoctorRepository} from '../../../users/doctor/domain/repositories/doctor.repository';
import {DoctorRepositoryImpl} from '../../../users/doctor/data/repositories/doctor.repository.impl';
import {Doctor} from '../../../users/doctor/domain/entities/doctor';
import {PaginatorMeta} from '../../../../core/shared/domain/entities/meta';
import {PaginatorHelper} from '../../../../core/helpers/PaginatorHelper';
import {PaginatorComponent} from '../../../../core/shared/presentation/paginator/paginator.component';
import {MediumBotton} from '../../../../core/shared/presentation/buttons/medium-botton/medium-botton';
import {PrimeTemplate} from 'primeng/api';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {NgClass} from '@angular/common';
import {AppointmentRepositoryImpl} from '../../data/repositories/appointment.repository.impl';
import {AppointmentRepository} from '../../domain/repositories/appointment.repository';
import {Divider} from 'primeng/divider';
import {ProfileRepository} from '../../../users/profile/domain/repositories/profile.repository';
import {ProfileRepositoryImpl} from '../../../users/profile/data/repositories/profile.repository.impl';
import {Profile} from '../../../users/profile/domain/entities/profile';

@Component({
  selector: 'app-create-appointment.component',
  imports: [
    DatePicker,
    FloatLabel,
    ReactiveFormsModule,
    PaginatorComponent,
    MediumBotton,
    PrimeTemplate,
    Step,
    StepList,
    StepPanel,
    StepPanels,
    Stepper,
    NgClass,
    Divider,
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})

export class CreateAppointmentComponent implements OnInit {

  private doctorRepository: DoctorRepository = inject(DoctorRepositoryImpl)
  private appointmentRepository: AppointmentRepository = inject(AppointmentRepositoryImpl)
  private profileRepository: ProfileRepository = inject(ProfileRepositoryImpl)

  patientProfile: Profile | null | undefined = null
  doctors: Doctor[] = [];
  availableAppointments: string[] = [];
  selectedDoctor: Doctor | null = null;
  selectedTime: string | null = null
  bannerMessage: string = ""
  paginatorMeta: PaginatorMeta = {
    from: 0,
    to: 0,
    current_page: 1,
    last_page: 0,
    total: 0,
    per_page: 6,
    pages: []
  }

  doctorForm = new FormGroup({
    doctorId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  patientForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  })

  appointmentForm: FormGroup = new FormGroup({
    doctorForm: this.doctorForm,
    patientForm: this.patientForm,
    note: new FormControl('', {
      nonNullable: false,
    }),
    date: new FormControl<Date | null>(null, {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  ngOnInit(): void {
    this.getDoctorPaginateService(this.paginatorMeta.current_page, this.paginatorMeta.per_page)
    this.loadPatientProfile()
  }

  setDoctorId(doctor: Doctor) {
    const doctorId = doctor.id.toString();
    this.doctorForm.patchValue({
      doctorId: doctorId
    })
    this.selectedDoctor = doctor
  }

  onDoctorNext(next: Function) {
    this.appointmentForm.get('date')?.reset();
    this.selectedTime = null
    this.availableAppointments = []
    this.bannerMessage = ""

    next();
  }

  next() {
    const perPage = this.paginatorMeta.per_page;
    const page = this.paginatorMeta.current_page + 1

    this.getDoctorPaginateService(page, perPage);
  }

  prev() {
    const perPage = this.paginatorMeta.per_page;
    const page = this.paginatorMeta.current_page - 1

    this.getDoctorPaginateService(page, perPage);
  }

  loadDoctors(page: number) {
    this.getDoctorPaginateService(page, this.paginatorMeta.per_page);
  }

  loadPatientProfile() {
    this.profileRepository.getProfile().subscribe((response) => {
      const profile = response?.profile;

      if (profile) {
        this.patientProfile = response?.profile;
        this.patientForm.get('name')?.patchValue(profile.name);
        this.patientForm.get('lastName')?.patchValue(profile.last_name);
      } else {
        this.patientProfile = null;
      }
    })
  }

  getDoctorPaginateService(page?: number, perPage?: number) {
    this.doctorRepository.getDoctors(page, perPage).subscribe((response) => {
      this.doctors = response.data;
      const responseMeta = response?.meta;
      const current = responseMeta?.current_page ?? 1;
      const last = responseMeta?.last_page ?? 0

      this.paginatorMeta = {
        ...this.paginatorMeta,
        from: responseMeta?.from ?? 0,
        to: responseMeta?.to ?? 0,
        current_page: current,
        last_page: responseMeta?.last_page ?? 0,
        total: responseMeta?.total ?? 0,
        per_page: responseMeta?.per_page ?? 0,
        pages: PaginatorHelper.getVisiblePages(current, last)
      }
    });
  }

  getAvailableAppointments(date: Date) {
    const doctorId = this.selectedDoctor?.id.toString();

    if (!doctorId) return;

    const dateFormatted = date.toISOString().split('T')[0];

    this.appointmentRepository.getAvailableDates(doctorId, dateFormatted).subscribe((response) => {

      const data = response.data

      if (!data || data.length == 0) {
        this.bannerMessage = response.message
        this.availableAppointments = []
        this.selectedTime = null
      } else {
        this.availableAppointments = data
        this.bannerMessage = ""
      }
    })
  }

  setAppointmentTime(time: string) {
    this.selectedTime = time
    const date = new Date(this.appointmentForm.get('date')?.value)
    const timeFormatted = time.split(':')
    date.setHours(parseInt(timeFormatted[0]))
    date.setMinutes(parseInt(timeFormatted[1]))

    this.appointmentForm.patchValue({
      date: date
    })
  }

  get selectedAppointmentDate(): string {

    const date = this.appointmentForm.get('date')?.value

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }

  get patientName(): string {

    const name = this.patientForm.get("name")?.value
    const middleName = this.patientForm.get('lastName')?.value

    return `${name} ${middleName}`
  }

  get appointmentNote(): string {
    return this.appointmentForm.get('note')?.value ?? ""
  }

  get firstNameIsFilled(): boolean {
    return !!this.patientProfile?.name;
  }

  get lastNameIsFilled(): boolean {
    return !!this.patientProfile?.last_name;
  }

  onSubmit() {
    const date = this.appointmentForm.get('date')?.value;
    const formattedDate = date?.toISOString().split('T')[0];

    const body = {
      doctor_id: this.selectedDoctor?.id.toString(),
      date: `${formattedDate} ${this.selectedTime}`,
      note: this.appointmentNote
    }
  }
}
