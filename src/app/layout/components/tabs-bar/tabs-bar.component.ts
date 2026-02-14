
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutStateService, AppContext } from '../../main/layout-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="lx-tabs w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center space-x-1 p-2 overflow-x-auto">
      
      @for (tab of tabs; track tab) {
        <button 
          (click)="selectTab(tab)"
          [class.lx-tab-active]="layoutState.currentContext() === tab"
          class="lx-tab-item relative px-6 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
          
          <span class="flex items-center space-x-2">
            <span class="material-icons text-base">{{ getIcon(tab) }}</span>
            <span>{{ tab }}</span>
          </span>

          <!-- Active Indicator -->
          @if (layoutState.currentContext() === tab) {
             <span class="absolute bottom-[-10px] left-0 w-full h-1 bg-indigo-600 rounded-t-lg animate-slide-up"></span>
          }
        </button>
      }

    </nav>
  `,
  styles: [`
    .lx-tab-active {
      @apply text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700 font-bold;
    }
    :host {
      display: block;
      width: 100%;
    }
    @keyframes slide-up {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
    }
    .animate-slide-up {
        animation: slide-up 0.2s ease-out;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsBarComponent {
  layoutState = inject(LayoutStateService);
  router = inject(Router);

  readonly tabs: AppContext[] = ['Protocol', 'Tablet', 'Mobile', 'Portal'];

  selectTab(tab: AppContext) {
    this.layoutState.setContext(tab);

    // Ensure sidebar is open when switching contexts
    if (this.layoutState.isSidebarCollapsed()) {
      this.layoutState.collapseSidebar(false);
    }

    // Redirect to the default route for the context
    switch (tab) {
      case 'Protocol':
        this.router.navigate(['/protocol/design']);
        break;
      case 'Tablet':
        this.router.navigate(['/tablet/design']);
        break;
      case 'Mobile':
        this.router.navigate(['/mobile/diary']);
        break;
      case 'Portal':
        this.router.navigate(['/portal/dashboard']);
        break;
    }
  }

  getIcon(tab: AppContext): string {
    switch (tab) {
      case 'Protocol': return 'assignment';
      case 'Tablet': return 'tablet_mac';
      case 'Mobile': return 'smartphone';
      case 'Portal': return 'web';
      default: return 'help';
    }
  }
}
