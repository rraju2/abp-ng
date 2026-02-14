
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Template-driven for simplicity
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LayoutStateService } from '../../layout/main/layout-state.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="lx-login min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      
      <div class="lx-login-card w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transform transition hover:scale-[1.01] duration-300">
        <!-- Logo Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl mb-4 shadow-inner">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" class="text-indigo-600" />
                    <path d="M12 24C12 24 16 16 24 16C32 16 36 24 36 24C36 24 32 32 24 32C16 32 12 24 12 24Z" stroke="currentColor" stroke-width="2" class="text-indigo-500" />
                    <circle cx="24" cy="24" r="4" fill="currentColor" class="text-indigo-600" />
                    <path d="M24 8V12M24 36V40M8 24H12M36 24H40" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-indigo-400" />
                </svg>
            </div>
            <h1 class="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                Vitalograph
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Clinical Design Engine</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input type="text" id="username" [(ngModel)]="username" name="username" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                       placeholder="Enter 'designer'" required>
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" id="password" [(ngModel)]="password" name="password" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                       placeholder="Enter 'designer'" required>
            </div>

            <!-- Error Message -->
            @if (errorMsg()) {
                <div class="text-red-500 text-sm text-center animate-pulse">
                    {{ errorMsg() }}
                </div>
            }

            <button type="submit" 
                    [disabled]="isLoading()"
                    class="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50">
                @if (isLoading()) {
                    Processing...
                } @else {
                    Sign In
                }
            </button>
        </form>

        <div class="mt-6 text-center text-xs text-gray-400">
            <p>Demo credentials:</p>
            <p>User: designer / Pass: designer</p>
            <p>User: admin / Pass: admin</p>
        </div>
      </div>

      <!-- Footer Credit -->
      <div class="absolute bottom-8 text-center w-full">
          <p class="text-xs text-gray-400 font-medium">
              Developed by <span class="text-indigo-500 font-bold">Trefoil Team</span>
          </p>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Digital Health Technologies</p>
      </div>

    </div>
  `
})
export class LoginComponent {
    authService = inject(AuthService);
    layoutState = inject(LayoutStateService);
    router = inject(Router);

    username = '';
    password = '';

    isLoading = signal(false);
    errorMsg = signal('');

    async onSubmit() {
        this.isLoading.set(true);
        this.errorMsg.set('');

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        const success = this.authService.login({
            user: this.username,
            pass: this.password
        });

        if (success) {
            // Redirect logic based on role
            if (this.authService.isDesigner()) {
                this.layoutState.resetToDesignerDefaults();
                this.router.navigate(['/protocol/design']); // Go directly to the dashboard
            } else {
                this.router.navigate(['/home']);
            }
        } else {
            this.errorMsg.set('Invalid credentials. Please try again.');
        }

        this.isLoading.set(false);
    }
}
