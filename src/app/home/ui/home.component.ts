
import { Component, ChangeDetectionStrategy, inject, signal, resource, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../../core/config/app-config.service';

interface ProjectStats {
  activeUsers: number;
  tasksCompleted: number;
  systemHealth: 'Good' | 'Warning' | 'Critical';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lx-home text-center animate-fade-in">
      <header class="lx-home-header mb-8">
        <h1 class="text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Welcome to {{ config.appName }}</h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Angular 20 & Signals Architecture
        </p>
      </header>

      <!-- Resource Loading State (Angular 19/20 Feature) -->
      @if (stats.isLoading()) {
          <div class="p-4 text-blue-500 animate-pulse">Loading dashboard stats...</div>
      } 
      @else if (stats.error()) {
          <div class="p-4 text-red-500">Failed to load stats. retrying...</div>
      } 
      @else {
          <section class="lx-features grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="lx-card bg-white p-6 rounded-lg shadow dark:bg-gray-800 border-l-4 border-l-indigo-500">
              <h3 class="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Users</h3>
              <div class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                 {{ stats.value()?.activeUsers }}
              </div>
            </div>

            <div class="lx-card bg-white p-6 rounded-lg shadow dark:bg-gray-800 border-l-4 border-l-green-500">
                <h3 class="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tasks Done</h3>
                <div class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {{ stats.value()?.tasksCompleted }}
                </div>
            </div>

            <div class="lx-card bg-white p-6 rounded-lg shadow dark:bg-gray-800 border-l-4 border-l-blue-500">
                <h3 class="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">System Health</h3>
                 <div class="text-3xl font-bold mt-2" 
                      [class.text-green-500]="stats.value()?.systemHealth === 'Good'"
                      [class.text-yellow-500]="stats.value()?.systemHealth === 'Warning'">
                    {{ stats.value()?.systemHealth }}
                </div>
            </div>

          </section>
      }

      <div class="mt-8 flex justify-center space-x-4">
          <button (click)="refreshStats()" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 transition">
             Refresh Data
          </button>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; padding: 2rem; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  configService = inject(AppConfigService);
  config = this.configService.config(); // Readonly signal

  // Angular 20 Resource API (Mock)
  // Replaces HttpClient + RxJS + AsyncPipe pattern for data fetching
  stats = resource({
    loader: async () => {
      // Simulate network latency
      await new Promise(r => setTimeout(r, 1500));

      // Return mock data
      return {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        tasksCompleted: Math.floor(Math.random() * 2000) + 500,
        systemHealth: Math.random() > 0.8 ? 'Warning' : 'Good'
      } as ProjectStats;
    }
  });

  refreshStats() {
    // Reload the resource
    this.stats.reload();
  }
}
