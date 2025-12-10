import {Doctor} from '../../domain/entities/doctor';
import {Links} from '../../../../../core/shared/domain/entities/links';
import {Meta} from '../../../../../core/shared/domain/entities/meta';

export interface DoctorsResponseModel {
  data: Doctor[]
  links: Links
  meta: Meta
}
