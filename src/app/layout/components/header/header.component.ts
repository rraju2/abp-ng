
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../../../core/config/app-config.service';
import { LayoutStateService } from '../../main/layout-state.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="lx-header">
      <div class="lx-header-content w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        
        <!-- Toggle Menu -->
        <button (click)="layoutState.toggleSidebar()" class="lx-menu-btn p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center">
          <span class="material-icons text-gray-600 dark:text-gray-300">menu</span>
        </button>

        <!-- Brand/Logo -->
        <div class="flex items-center ml-4">
            <div class="mr-3 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-xl shadow-inner flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" />
                    <path d="M12 24C12 24 16 16 24 16C32 16 36 24 36 24C36 24 32 32 24 32C16 32 12 24 12 24Z" stroke="currentColor" stroke-width="3" />
                    <circle cx="24" cy="24" r="5" fill="currentColor" />
                </svg>
            </div>
            <div class="flex flex-col">
                <h1 class="lx-brand text-lg font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight leading-none">
                    {{ configService.config().appName }}
                </h1>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ authService.isDesigner() ? 'Designer View' : 'Standard View' }}</span>
            </div>
        </div>

        <!-- Right Side: User/Theme Profile -->
        <div class="lx-profile flex items-center space-x-4">
          
          <!-- Role Toggler (Dev Tool) -->
          <button (click)="authService.toggleRole()" title="Switch Role" 
                  class="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-100 transition whitespace-nowrap hidden md:block">
              Switch to {{ authService.isDesigner() ? 'User' : 'Designer' }}
          </button>

          <!-- Theme Toggle -->
          <button (click)="toggleTheme()" 
                  class="lx-theme-btn p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition relative overflow-hidden group">
             <!-- Angular 20 Control Flow -->
             @if (configService.config().theme === 'dark') {
                <span class="material-icons text-yellow-500 animate-spin-slow">light_mode</span>
             } @else {
                <span class="material-icons text-gray-500 group-hover:text-indigo-600">dark_mode</span>
             }
          </button>
          
          <!-- User Avatar -->
          <div class="lx-user avatar bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-indigo-200 dark:ring-indigo-900 cursor-pointer">
             <span>{{ authService.currentUser().name.substring(0, 2).toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      z-index: 1000;
    }
    .animate-spin-slow {
        animation: spin 3s linear infinite;
    }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  configService = inject(AppConfigService);
  layoutState = inject(LayoutStateService);
  authService = inject(AuthService);

  toggleTheme() {
    const nextTheme = this.configService.config().theme === 'dark' ? 'light' : 'dark';
    this.configService.updateTheme(nextTheme);

    // Apply class to body (Side effect usually handled in service or effect, doing here for simplicity)
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
