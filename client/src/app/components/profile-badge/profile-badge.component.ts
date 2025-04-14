import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Img, User } from '../../../../types/UserType';
import { Sex } from '../../../../../shared/enums/user.enum';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-badge.component.html',
  styleUrls: ['./profile-badge.component.css'],
})
export class ProfileBadgeComponent implements OnInit {
  @Input() user!: User;
  userImageBase64: string | null = null;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.userImageBase64 = this.imgToBase64();
  }

  getSexDisplayText(): string {
    if (!this.user.sex) return 'Not specified';

    return {
      [Sex.Male]: 'Male',
      [Sex.Female]: 'Female',
      [Sex.Other]: 'Other',
    }[this.user.sex];
  }

  getAge(): number | null {
    if (!this.user.birthdate) return null;

    const birthDate = new Date(this.user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  imgToBase64(): string | null {
    if (this.user.img) {
      if (typeof this.user.img === 'string') {
        return `data:image/jpeg;base64,${this.user.img}`;
      }

      return this.imageService.bufferToBase64(this.user.img);
    }
    return null;
  }

  base64ToBuffer(base64String: string): Img | null {
    return this.imageService.base64ToBuffer(base64String);
  }
}
