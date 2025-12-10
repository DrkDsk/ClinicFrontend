import {Component, inject, OnInit} from '@angular/core';
import {LargeButton} from '../../../../../core/shared/presentation/buttons/large-button/large-button';
import {NavigationFacade} from '../../../../../core/facade/navigation.facade';
import {AppPaths} from '../../../../../core/constants/path.constants';
import {Button} from 'primeng/button';
import {Doctor} from '../../domain/entities/doctor';
import {DoctorRepository} from '../../domain/repositories/doctor.repository';
import {DoctorRepositoryImpl} from '../../data/repositories/doctor.repository.impl';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {TableComponent} from '../../../../../core/shared/presentation/table/table.component';
import {PaginatorMeta} from '../../../../../core/shared/domain/entities/meta';
import {PaginatorService} from '../../../../../core/shared/data/services/paginator/paginator.service';

@Component({
  selector: 'app-doctors.component',
  imports: [
    LargeButton,
    Button,
    FormsModule,
    TableComponent
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {

  private doctorRepository: DoctorRepository = inject(DoctorRepositoryImpl)
  private navigationFacade: NavigationFacade = inject(NavigationFacade)
  private paginatorService = inject(PaginatorService)
  private searchSubject = new Subject<string>();

  doctors: Doctor[] = [];
  originalDoctors: Doctor[] = [];
  doctorQuery = ""
  paginatorMeta!: PaginatorMeta

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((valor) => {
        this.callToSearchDoctor(valor)
      });

    this.getDoctorPaginateService()
  }

  onQueryChange(value: string) {
    this.searchSubject.next(value);
  }

  callToSearchDoctor(query: string) {
    if (!query.length) {
      this.getDoctorPaginateService()
      return;
    }

    if (this.originalDoctors.length === 0) {
      this.originalDoctors = [...this.doctors];
    }
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

  reset() {
    this.paginatorMeta = {
      ...this.paginatorMeta,
      from: 0,
      total: 0,
      per_page: 0
    };
    this.getDoctorPaginateService()
  }

  isLastPage(): boolean {
    return this.paginatorMeta.current_page === this.paginatorMeta.last_page;
  }

  isFirstPage(): boolean {
    return this.paginatorMeta.current_page === 1;
  }

  loadDoctors(page: number) {
    this.getDoctorPaginateService(page, this.paginatorMeta.per_page);
  }

  getDoctorPaginateService(page?: number, perPage?: number) {
    this.paginatorService.paginate<Doctor>(
      (page, perPage) => this.doctorRepository.getDoctors(page, perPage),
      page,
      perPage
    ).subscribe(response => {
      this.doctors = response.items
      this.paginatorMeta = response.meta
    })
  }

  columns = [
    {header: 'Nombre', cell: (d: any) => d.profile.name},
    {header: 'Especialidad', field: 'specialty'},
  ];

  navigateToCreateProfile = () => {
    this.navigationFacade.navigate(AppPaths.createDoctor);
  };
}
