import { Component, OnInit } from '@angular/core';
import { Test } from '../../../../types/TestType';
import { TestService } from '../../service/test.service';
import { CommonModule } from '@angular/common';
import { TestBadgeComponent } from '../../components/test-badge/test-badge.component';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
  imports: [CommonModule, TestBadgeComponent],
  standalone: true,
})
export class TestListComponent implements OnInit {
  tests: Test[] = [];
  total = 0;
  page = 1;
  limit = 5;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.testService.getTests(this.page, this.limit).subscribe((res) => {
      this.tests = res.data;
      this.total = res.total;
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadTests();
  }
}
