import {Role} from "../../../../core/shared/domain/entities/roles"
import {Profile} from '../../../users/profile/domain/entities/profile';

export interface User {
  id: string
  profile: Profile,
  roles: [Role]
}
