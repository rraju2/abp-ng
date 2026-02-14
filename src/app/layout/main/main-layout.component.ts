
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TabsBarComponent } from '../components/tabs-bar/tabs-bar.component';
import { LayoutStateService } from '../main/layout-state.service';
import { AppConfigService } from '../../core/config/app-config.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, TabsBarComponent],
  template: `
    <div class="lx-layout h-screen overflow-hidden flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <!-- Sidebar (Desktop) -->
      <app-sidebar class="lx-sidebar-container hidden md:block sticky top-0 h-screen overflow-hidden"
        [class.w-16]="layoutState.isSidebarCollapsed()"
        [class.w-64]="!layoutState.isSidebarCollapsed()">
      </app-sidebar>

      <!-- Main Content Area -->
      <main class="lx-main flex-1 flex flex-col overflow-hidden relative">
        <!-- Main Header -->
        <app-header class="lx-header-container h-16"></app-header>
        
        <!-- Tabs Bar (Only for Designers) -->
        @if (authService.isDesigner()) {
            <app-tabs-bar class="lx-tabs-container h-12 z-20"></app-tabs-bar>
        }

        <!-- Content Area -->
        <div class="lx-content-wrapper flex-1 overflow-y-auto p-6 md:p-8">
            <div class="lx-content-bg bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-full">
                <router-outlet></router-outlet>
            </div>
        </div>

        <!-- Footer -->
        <footer class="lx-footer p-4 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700">
            &copy; 2026 Vitalograph. Powered by ABP.IO
        </footer>
      </main>
      
      <!-- Mobile Sidebar Overlay -->
      @if (layoutState.isMobile() && layoutState.isSidebarOpen()) {
        <div (click)="layoutState.toggleSidebar()"
             class="lx-overlay fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in">
        </div>
      }
      
       <!-- Mobile Sidebar -->
      @if (layoutState.isMobile() && layoutState.isSidebarOpen()) {
        <app-sidebar 
             class="lx-sidebar-mobile fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300 shadow-xl">
        </app-sidebar>
      }

    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .animate-fade-in {
        animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  layoutState = inject(LayoutStateService);
  configService = inject(AppConfigService);
  authService = inject(AuthService);
}
