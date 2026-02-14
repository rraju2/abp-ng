
import { Component, model, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Still needed for ngModel inside, or we use native events

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span class="material-icons text-gray-400">search</span>
      </div>
      
      <!-- Angular 20: Using Two-Way Binding with Signals -->
      <input 
        type="text" 
        [placeholder]="placeholder()" 
        [value]="query()" 
        (input)="onInput($event)"
        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
      >
      
      <button *ngIf="query()" (click)="clear()" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <span class="material-icons text-gray-400 hover:text-gray-600 cursor-pointer">close</span>
      </button>
    </div>
  `
})
export class SearchInputComponent {
    // Configurable input
    readonly placeholder = input<string>('Search...');

    // Two-way binding signal (Angular 17.2+ feature, standard in v20)
    // Parent can bind via [(query)]="searchTerm"
    readonly query = model<string>('');

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.query.set(val);
    }

    clear() {
        this.query.set('');
    }
}
