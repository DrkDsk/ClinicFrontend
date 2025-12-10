import {Meta} from './meta';

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}
