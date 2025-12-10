import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {PaginatedResponse} from '../../../domain/entities/paginator.response';
import {PaginatorMeta} from '../../../domain/entities/meta';
import {PaginatorHelper} from '../../../../helpers/PaginatorHelper';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  paginate<T>(
    fetchFn: (page?: number, perPage?: number) => Observable<PaginatedResponse<T>>,
    page: number = 1,
    perPage: number = 10
  ): Observable<{ items: T[], meta: PaginatorMeta }> {

    return fetchFn().pipe(
      map(response => {
        const r = response.meta;

        const meta: PaginatorMeta = {
          from: r?.from ?? 0,
          to: r?.to ?? 0,
          current_page: r?.current_page ?? page,
          last_page: r?.last_page ?? 1,
          total: r?.total ?? 0,
          per_page: r?.per_page ?? perPage,
          pages: PaginatorHelper.getVisiblePages(r?.current_page, r?.last_page)
        };

        return {items: response.data, meta};
      })
    );
  }

}
