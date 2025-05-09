import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../types/UserType';
import { Sex } from '../../../../../shared/enums/user.enum';
import { ImageService } from '../../service/image.service';
import { Store } from '@ngrx/store';
import { updateUser } from '../../store/user/user.actions';
import { Constraints } from '../../../../../shared/constraints/database.constraint';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-badge.component.html',
  styleUrls: ['./profile-badge.component.css'],
})
export class ProfileBadgeComponent implements OnInit {
  @Input() user!: User;

  profileForm!: FormGroup;
  userImageBase64: string | null = null;
  age: number | null = null;
  isEditing = false;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  readonly nicknameMaxLength = Constraints.User.nicknameMaxLength;
  readonly bioMaxLength = Constraints.User.bioMaxLength;
  readonly imgMaxSize = Constraints.User.imgMaxLength / 2;

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initComponent();
    this.initForm();
  }

  private initComponent(): void {
    this.userImageBase64 = this.imageService.getImageSrc(this.user?.img);
    this.age = this.getAge();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      nickname: [
        this.user.nickname,
        [Validators.required, Validators.maxLength(this.nicknameMaxLength)],
      ],
      bio: [this.user.bio || '', [Validators.maxLength(this.bioMaxLength)]],
      birthdate: [
        this.user.birthdate
          ? new Date(this.user.birthdate).toISOString().split('T')[0]
          : null,
      ],
      sex: [this.user.sex || null],
    });
  }

  getSexDisplayText(): string {
    if (!this.user.sex) return 'Not specified';
    return {
      [Sex.Male]: 'Чоловік',
      [Sex.Female]: 'Жінка',
      [Sex.Other]: 'Інша',
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

  startEditing(): void {
    this.isEditing = true;
    this.profileForm.patchValue({
      nickname: this.user.nickname,
      bio: this.user.bio || '',
      birthdate: this.user.birthdate
        ? new Date(this.user.birthdate).toISOString().split('T')[0]
        : null,
      sex: this.user.sex || null,
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.previewImage = null;
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (this.selectedFile.size > this.imgMaxSize) {
        this.profileForm.setErrors({ imageSize: true });
      } else {
        this.profileForm.setErrors(null);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target?.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  saveChanges(): void {
    if (this.profileForm.invalid) return;

    const formValue = this.profileForm.value;
    const updatedUser: Partial<User> = {
      ...this.user,
      nickname: formValue.nickname,
      bio: formValue.bio,
      sex: formValue.sex ?? null,
      birthdate: formValue.birthdate
        ? new Date(formValue.birthdate).toISOString()
        : null,
      img: this.selectedFile ? this.previewImage : this.user.img,
    };

    updatedUser.img = this.imageService.getImageSrc(updatedUser.img);
    this.store.dispatch(updateUser({ updatedUser }));
    window.location.reload();
  }

  get sexOptions() {
    return [
      { value: Sex.Male, label: 'Чоловік' },
      { value: Sex.Female, label: 'Жінка' },
      { value: Sex.Other, label: 'Інша' },
    ];
  }

  get nicknameError(): boolean {
    return this.profileForm.get('nickname')?.errors?.['maxlength'];
  }

  get bioError(): boolean {
    return this.profileForm.get('bio')?.errors?.['maxlength'];
  }

  get birthdateError(): boolean {
    const birthdate = this.profileForm.get('birthdate')?.value;
    return birthdate && new Date(birthdate) > new Date();
  }

  get imageError(): boolean {
    return this.profileForm.errors?.['imageSize'];
  }

  get isFormInvalid(): boolean {
    return this.profileForm.invalid || this.birthdateError || this.imageError;
  }
}
