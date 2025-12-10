import {Profile} from '../../../profile/domain/entities/profile';

export interface Patient {
  id: number
  weight?: string
  height?: string
  weight_measure_type?: string
  height_measure_type?: string
  profile: Profile
}
