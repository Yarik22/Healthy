import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Constraints } from '../../../../shared/constraints/database.constraint';
import { MentalState } from '../../../../shared/enums/therapy.enum';
import { TherapyService } from '../../service/therapy.service';
@Component({
  selector: 'app-test-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.css'],
})
export class TestCreateComponent implements OnInit {
  constraints = Constraints;
  testForm: FormGroup;
  loading = false;
  imageBase64: string | null = null;
  fileError: string | null = null;
  translatedMentalStates: { key: MentalState; label: string }[] = [];

  apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/tests`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private therapyService: TherapyService
  ) {
    this.testForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(Constraints.Test.titleMaxLength),
        ],
      ],
      description: [
        '',
        Validators.maxLength(Constraints.Test.descriptionMaxLength),
      ],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.translatedMentalStates = Object.values(MentalState).map((key) => ({
      key,
      label: this.therapyService.getTranslatedMentalState(key),
    }));
  }

  get questions(): FormArray {
    return this.testForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(Constraints.Question.titleMaxLength),
        ],
      ],
      description: [
        '',
        Validators.maxLength(Constraints.Question.descriptionMaxLength),
      ],
      answers: this.fb.array([this.createAnswer(), this.createAnswer()]),
    });
    this.questions.push(questionGroup);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addAnswer(questionIndex: number): void {
    this.getAnswers(questionIndex).push(this.createAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      text: [
        '',
        [
          Validators.required,
          Validators.maxLength(Constraints.Answer.textMaxLength),
        ],
      ],
      influence: [
        0,
        [
          Validators.required,
          Validators.min(Constraints.Answer.influenceMin),
          Validators.max(Constraints.Answer.influenceMax),
        ],
      ],
      mentalState: ['', Validators.required],
      img: [null],
    });
  }

  handleFileUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileError = null;

    if (!file) return;

    if (file.size > Constraints.Test.imgMaxLength) {
      this.fileError = 'Розмір зображення не повинен перевищувати 1 МБ.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.testForm.invalid || this.fileError) return;

    const payload = {
      ...this.testForm.value,
      img: this.imageBase64,
    };

    this.loading = true;
    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tests']);
      },
      error: (err) => {
        console.error('Test creation failed', err);
        this.loading = false;
      },
    });
  }
}
