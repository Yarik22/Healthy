import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isScrolled: boolean = false;
  showHeader: boolean = true;
  showFooter: boolean = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const noHeaderRoutes = ['/error'];
        const noFooterRoutes = ['/error'];

        const currentRoute = event.urlAfterRedirects.split('?')[0];
        this.showHeader = !noHeaderRoutes.includes(currentRoute);
        this.showFooter = !noFooterRoutes.includes(currentRoute);

        const routeParams = this.route.snapshot.firstChild?.params;
        if (currentRoute.startsWith('/error') && routeParams) {
          this.showHeader = false;
          this.showFooter = false;
        }
      }
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
