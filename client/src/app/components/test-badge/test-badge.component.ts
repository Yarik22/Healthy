import { Component, Input, OnInit } from '@angular/core';
import { Test } from '../../../../types/TestType';
import { TestService } from '../../service/test.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-test-badge',
  templateUrl: './test-badge.component.html',
  styleUrls: ['./test-badge.component.css'],
  imports: [CommonModule, RouterModule, LoaderComponent],
})
export class TestBadgeComponent implements OnInit {
  @Input() test!: Test;
  totalQuestions: number = 0;
  usersPassed: number = 0;
  isLoading: boolean = true;
  isHovered: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    if (this.test?.uuid) {
      this.loadTestInfo();
    }
  }

  loadTestInfo(): void {
    this.isLoading = true;
    this.testService.getTestInfo(this.test.uuid).subscribe({
      next: (info) => {
        this.totalQuestions = info.totalQuestions;
        this.usersPassed = info.usersPassed;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
