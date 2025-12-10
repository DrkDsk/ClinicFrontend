import {Profile} from '../../domain/entities/profile';
import {Links} from '../../../../../core/shared/domain/entities/links';
import {Meta} from '../../../../../core/shared/domain/entities/meta';

export interface PeopleDataResponseModel {
  data: Profile[]
  links: Links
  meta: Meta
}
