// import { Component, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { loadTests } from '../../store/test/test.actions';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { LoaderComponent } from '../../components/loader/loader.component';
// import { FormsModule } from '@angular/forms';
// import { Test } from '../../../../types/TestType';
// import { selectLoading, selectError } from '../../store/therapy/therapy.selectors';

// @Component({
//   selector: 'app-test-list',
//   standalone: true,
//   templateUrl: './tests.component.html',
//   styleUrls: ['./tests.component.css'],
//   imports: [CommonModule, RouterModule, LoaderComponent, FormsModule]
// })
// export class TestListComponent implements OnInit {
//   tests$ = this.store.select(selectTests);
//   loading$ = this.store.select(selectLoading);
//   error$ = this.store.select(selectError);
//   totalTests$ = this.store.select(selectTotalTests);
  
//   currentPage = 1;
//   itemsPerPage = 9;
//   searchQuery = '';

//   constructor(private store: Store) {}

//   ngOnInit(): void {
//     this.loadTests();
//   }

//   loadTests(): void {
//     this.store.dispatch(loadTests({ 
//       page: this.currentPage, 
//       limit: this.itemsPerPage,
//       search: this.searchQuery 
//     }));
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadTests();
//   }

//   onSearch(): void {
//     this.currentPage = 1;
//     this.loadTests();
//   }

//   trackByTestId(index: number, test: Test): string {
//     return test.uuid;
//   }
// }