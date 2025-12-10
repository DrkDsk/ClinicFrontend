import {Component, inject, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {Profile} from '../domain/entities/profile';
import {ProfileRepository} from '../domain/repositories/profile.repository';
import {ProfileRepositoryImpl} from '../data/repositories/profile.repository.impl';
import {TableComponent} from '../../../../core/shared/presentation/table/table.component';
import {PaginatorMeta} from '../../../../core/shared/domain/entities/meta';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {PaginatorService} from '../../../../core/shared/data/services/paginator/paginator.service';

@Component({
  selector: 'app-profile.component',
  imports: [
    Button,
    FormsModule,
    TableComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {

  private profileRepository: ProfileRepository = inject(ProfileRepositoryImpl)
  private paginatorService = inject(PaginatorService)
  private searchSubject = new Subject<string>();

  people: Profile[] = [];
  originalPeople: Profile[] = [];
  paginatorMeta!: PaginatorMeta

  enablePagination = true;
  peopleQuery = ""

  columns = [
    {header: 'Nombre', field: 'name'},
    {header: 'Correo electrónico', field: 'email'},
    {header: 'Teléfono', field: 'phone'},
  ];

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe((valor) => {
        this.callToSearchPeople(valor)
      });

    this.getProfilePaginateService()
  }

  onQueryChange(value: string) {
    this.searchSubject.next(value);
  }

  next() {
    const perPage = this.paginatorMeta.per_page;
    const page = this.paginatorMeta.current_page + 1

    this.getProfilePaginateService(page, perPage);
  }

  prev() {
    const perPage = this.paginatorMeta.per_page;
    const page = this.paginatorMeta.current_page - 1

    this.getProfilePaginateService(page, perPage);
  }

  reset() {
    this.paginatorMeta = {
      ...this.paginatorMeta,
      from: 0,
      total: 0,
      per_page: 0
    };
    this.getProfilePaginateService()
  }

  isLastPage(): boolean {
    return this.paginatorMeta.current_page === this.paginatorMeta.last_page;
  }

  isFirstPage(): boolean {
    return this.paginatorMeta.current_page === 1;
  }

  loadProfiles(page: number) {
    this.getProfilePaginateService(page, this.paginatorMeta.per_page);
  }

  callToSearchPeople(query: string) {
    if (!query.length) {
      this.enablePagination = true;
      this.getProfilePaginateService()
      return;
    }

    if (this.originalPeople.length === 0) {
      this.originalPeople = [...this.people];
    }

    this.profileRepository.search(query).subscribe((response) => {
      this.people = response.data
      this.enablePagination = false
    })
  }

  getProfilePaginateService(page?: number, perPage?: number) {
    this.paginatorService.paginate<Profile>(
      (page, perPage) => this.profileRepository.getProfilesPaginate(page, perPage),
      page,
      perPage
    ).subscribe(response => {
      this.people = response.items
      this.paginatorMeta = response.meta
    })
  }
}
