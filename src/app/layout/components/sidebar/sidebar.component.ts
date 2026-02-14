
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutStateService } from '../../main/layout-state.service';
import { AppConfigService } from '../../../core/config/app-config.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="lx-sidebar shadow-lg bg-gray-900 text-white h-full transition-all duration-300 flex flex-col"
           [class.lx-sidebar-collapsed]="layoutState.isSidebarCollapsed() && !layoutState.isMobile()"
           [class.lx-sidebar-open]="layoutState.isSidebarOpen() || !layoutState.isMobile()"
           [class.lx-mobile]="layoutState.isMobile()">
      
      <!-- Sidebar Header -->
      <div class="lx-sidebar-header p-4 border-b border-gray-700 font-bold text-xl flex justify-between items-center bg-gray-950">
        @if (!layoutState.isSidebarCollapsed()) {
            <span>Vitalograph</span>
        } @else {
            <span>V</span>
        }
        
        @if (layoutState.isMobile()) {
            <button (click)="layoutState.toggleSidebar()" class="lg:hidden text-gray-400 hover:text-white">
                <span class="material-icons">close</span>
            </button>
        }
      </div>

      <!-- Current Context Badge -->
      @if (!layoutState.isSidebarCollapsed()) {
        <div class="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 bg-gray-800 animate-fade-in">
             {{ layoutState.currentContext() }}
        </div>
      }

      <!-- Navigation -->
      <nav class="lx-sidebar-nav flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1 px-2">
          
          <!-- Dynamic Menu Items based on Selected Tab Context -->
          @for (item of layoutState.currentMenu(); track item.label + item.route + (item.queryParams?.id || '')) {
            <li>
                <a [routerLink]="item.route" 
                   [queryParams]="item.queryParams || {}"
                   [routerLinkActive]="item.disabledActive ? '' : 'lx-nav-active bg-indigo-600 text-white'"
                   [routerLinkActiveOptions]="{ exact: item.exact || false }"
                   (click)="item.action ? item.action() : null"
                   class="lx-nav-item flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 group cursor-pointer">
                  <span class="material-icons mr-3 text-lg group-hover:text-white transition-colors">{{ item.icon }}</span>
                  
                  @if (!layoutState.isSidebarCollapsed()) {
                      <span class="text-sm font-medium animate-slide-right">{{ item.label }}</span>
                  }
                </a>
            </li>
          }

        </ul>
      </nav>
      
      <!-- Footer Collapse Button -->
      <div class="lx-sidebar-footer p-4 border-t border-gray-700 w-full bg-gray-950 space-y-4">
         @if (!layoutState.isSidebarCollapsed()) {
             <div class="lx-development-credit px-1 animate-slide-right">
                 <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Developed by</p>
                 <p class="text-xs text-indigo-400 font-extrabold tracking-tight">Trefoil Team</p>
                 <p class="text-[9px] text-gray-600 font-medium">Digital Health Technologies</p>
             </div>
         } @else {
             <div class="flex justify-center animate-fade-in" title="Trefoil Team | Digital Health Technologies">
                 <span class="text-xs font-black text-indigo-500 bg-indigo-500/10 w-6 h-6 rounded flex items-center justify-center">T</span>
             </div>
         }

         <button (click)="toggleCollapse()" class="w-full h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all transform active:scale-95 bg-gray-900 shadow-inner">
           <span class="material-icons text-lg">{{ layoutState.isSidebarCollapsed() ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left' }}</span>
         </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    @keyframes slide-right {
        from { opacity: 0; transform: translateX(-5px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-right {
        animation: slide-right 0.2s ease-out;
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  layoutState = inject(LayoutStateService);
  configService = inject(AppConfigService);

  toggleCollapse() {
    this.layoutState.collapseSidebar(!this.layoutState.isSidebarCollapsed());
  }
}
