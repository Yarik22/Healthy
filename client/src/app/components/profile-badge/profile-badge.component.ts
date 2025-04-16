import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../types/UserType';
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
  age: number | null = null;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.userImageBase64 = this.imageService.getImageSrc(this.user?.img);
    this.age = this.getAge();
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

  getInitials(): string {
    if (!this.user.nickname) return '?';
    return this.user.nickname.charAt(0).toUpperCase();
  }
}
