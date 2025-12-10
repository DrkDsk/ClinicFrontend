import {Component, inject, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';
import {Profile} from '../../domain/entities/profile';
import {ProfileRepository} from '../../domain/repositories/profile.repository';
import {ProfileRepositoryImpl} from '../../data/repositories/profile.repository.impl';
import {AppPaths} from '../../../../../core/constants/path.constants';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile-card',
  imports: [
    Avatar,
    Ripple,
    RouterLink
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit {

  profile: Profile | null = null
  private profileRepository: ProfileRepository = inject(ProfileRepositoryImpl);

  ngOnInit(): void {
    this.profileRepository.getProfile().subscribe(response => {
      if (response === null) {
        return;
      }

      this.profile = response?.profile;
    })
  }

  protected readonly AppPaths = AppPaths;
}
