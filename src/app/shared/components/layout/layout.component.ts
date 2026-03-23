import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CompareBarComponent } from '../compare-bar/compare-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CompareBarComponent],
  template: `
    <div class="app-shell">
      <app-navbar />
      <main class="app-main">
        <router-outlet />
      </main>
      <app-footer />
      <app-compare-bar />
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-main {
      flex: 1;
    }
  `],
})
export class LayoutComponent {}
