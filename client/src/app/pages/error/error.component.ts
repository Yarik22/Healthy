import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  code: string = 'Error';
  title: string = 'Oops!';
  message: string = 'An unexpected error occurred.';
  icon: string = '🚫';
  buttonText: string = 'Go Home';
  buttonLink: string = '/home';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.code = params.get('code') ?? this.code;
      this.title = decodeURIComponent(params.get('title') ?? this.title);
      this.message = decodeURIComponent(params.get('message') ?? this.message);
      this.icon = params.get('icon') ?? this.icon;
      this.buttonText = decodeURIComponent(
        params.get('buttonText') ?? this.buttonText
      );
      this.buttonLink = decodeURIComponent(
        params.get('buttonLink') ?? this.buttonLink
      );
    });
  }

  navigateToLink(): void {
    window.location.href = this.buttonLink;
  }
}
