
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProxyService, UserDto } from '../../proxy/users/user.service';
import { ButtonComponent } from '../../shared/components/custom-button.component';
import { SearchInputComponent } from '../../shared/components/search-input.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SearchInputComponent],
    template: `
    <div class="lx-page w-full animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Identity Management</h2>
        
        <div class="flex items-center space-x-2 w-full md:w-auto">
            <!-- New Two-Way Binding with Signal -->
            <app-search-input [(query)]="searchTerm" placeholder="Search by name..." class="w-full md:w-64"></app-search-input>

            <app-button type="primary" (click)="refresh()" label="Refresh" class="hidden md:block">
               <span class="material-icons text-sm mr-1">refresh</span>
            </app-button>
        </div>
      </div>

      <!-- Filters & Stats -->
      <div class="filters mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex justify-between items-center transition-all duration-300">
         <label class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 cursor-pointer">
           <input type="checkbox" [checked]="showActiveOnly()" (change)="toggleActiveFilter()" 
                  class="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 h-4 w-4">
           <span>Show Active Only</span>
         </label>
         
         <div class="text-sm text-gray-500">
             Found <span class="font-bold text-indigo-600">{{ displayedUsers().length }}</span> users
         </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" (click)="toggleSort('name')">
                        User Name <span class="material-icons text-xs align-middle ml-1">{{ getSortIcon('name') }}</span>
                    </th>
                    <th scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" (click)="toggleSort('email')">
                        Email <span class="material-icons text-xs align-middle ml-1">{{ getSortIcon('email') }}</span>
                    </th>
                    <th scope="col" class="px-6 py-3">Status</th>
                    <th scope="col" class="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Transition Group Example for Angular 20 (Simulated via class) -->
                @for (user of displayedUsers(); track user.id) {
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 relative group">
                        
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-xs font-bold uppercase ring-2 ring-transparent group-hover:ring-indigo-200 transition-all">
                                {{ user.userName.substring(0, 2) }}
                            </div>
                            {{ user.userName }}
                        </td>
                        <td class="px-6 py-4">
                            {{ user.email }}
                        </td>
                        <td class="px-6 py-4">
                            <span [class]="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                                  class="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-transparent">
                               {{ user.isActive ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center">
                                <span class="material-icons text-sm mr-1">edit</span> Edit
                            </button>
                            <button class="font-medium text-red-600 dark:text-red-500 hover:underline inline-flex items-center">
                                <span class="material-icons text-sm mr-1">delete</span> Delete
                            </button>
                        </td>
                    </tr>
                } @empty {
                    <tr>
                        <td colspan="4" class="px-6 py-12 text-center text-gray-400">
                           <div class="flex flex-col items-center justify-center">
                               <span class="material-icons text-4xl mb-2 text-gray-300">search_off</span>
                               <p>No users found matching "{{ searchTerm() }}"</p>
                           </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
    userService = inject(UserProxyService);

    // --- Local Signals ---
    showActiveOnly = signal(false);
    searchTerm = signal(''); // Bound via [(query)]
    sortField = signal<'name' | 'email'>('name');
    sortDirection = signal<'asc' | 'desc'>('asc');

    // --- Computed Pipeline (Angular 20 Style) ---
    displayedUsers = computed(() => {
        let users = this.userService.users();

        // 1. Filter by Active Status
        if (this.showActiveOnly()) {
            users = users.filter(u => u.isActive);
        }

        // 2. Filter by Search Term
        const term = this.searchTerm().toLowerCase();
        if (term) {
            users = users.filter(u =>
                u.userName.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                u.name.toLowerCase().includes(term)
            );
        }

        // 3. Sort
        const field = this.sortField();
        const direction = this.sortDirection() === 'asc' ? 1 : -1;

        return [...users].sort((a, b) => { // Spread to avoid mutation
            const valA = field === 'name' ? a.userName : a.email;
            const valB = field === 'name' ? b.userName : b.email;
            return valA.localeCompare(valB) * direction;
        });
    });

    constructor() {
        // Example of effect() for side effects (logging, analytics)
        effect(() => {
            console.log(`Filter changed: Actve=${this.showActiveOnly()}, Search="${this.searchTerm()}"`);
        });
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.userService.getList({ maxResultCount: 10, skipCount: 0 });
    }

    toggleActiveFilter() {
        // update() is the standard way to mutate signals
        this.showActiveOnly.update(v => !v);
    }

    toggleSort(field: 'name' | 'email') {
        if (this.sortField() === field) {
            this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortField.set(field);
            this.sortDirection.set('asc');
        }
    }

    getSortIcon(field: 'name' | 'email'): string {
        if (this.sortField() !== field) return 'unfold_more';
        return this.sortDirection() === 'asc' ? 'expand_less' : 'expand_more';
    }
}
