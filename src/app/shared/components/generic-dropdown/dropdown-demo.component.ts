
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericDropdownComponent } from './generic-dropdown.component';
import { DropdownOption, DropdownConfig } from './dropdown.models';

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, GenericDropdownComponent],
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-12 animate-fade-in">
      <header class="border-b border-gray-100 dark:border-gray-800 pb-8">
        <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Generic Dropdown</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">A high-performance, reusable selector with validation, search, and dynamic item creation.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <!-- Case 1: Simple Single Select -->
        <section class="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-700">
          <div class="flex items-center space-x-3 text-indigo-600">
            <span class="material-icons">person</span>
            <h3 class="text-lg font-bold">User Selection</h3>
          </div>
          
          <app-generic-dropdown 
            label="Assignee"
            [options]="userOptions()"
            [config]="singleConfig()"
            [(ngModel)]="selectedUser"
            (optionAdded)="onUserAdded($event)">
          </app-generic-dropdown>

          <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
             <p class="text-xs font-bold uppercase text-gray-400 mb-1">Current Value:</p>
             <code class="text-xs text-indigo-500">{{ selectedUser() || 'null' }}</code>
          </div>
        </section>

        <!-- Case 2: Multi-Select with Validation -->
        <section class="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-700">
          <div class="flex items-center space-x-3 text-emerald-600">
            <span class="material-icons">sell</span>
            <h3 class="text-lg font-bold">Project Tags</h3>
          </div>

          <form [formGroup]="demoForm" class="space-y-4">
            <app-generic-dropdown 
              label="Select Multiple Tags"
              [options]="tagOptions()"
              [config]="multiConfig()"
              formControlName="tags"
              [error]="tagError()">
            </app-generic-dropdown>

            <div class="flex space-x-2">
              <button (click)="submitForm()" 
                      class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all">
                Validate Form
              </button>
              <button (click)="demoForm.reset()" 
                      class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Reset
              </button>
            </div>
          </form>

          <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
             <p class="text-xs font-bold uppercase text-gray-400 mb-1">Form Status:</p>
             <span class="text-xs font-bold" [class.text-emerald-500]="demoForm.valid" [class.text-rose-500]="!demoForm.valid">
                {{ demoForm.valid ? 'VALID' : 'INVALID (Requires 1+ tag)' }}
             </span>
             <p class="text-xs text-gray-500 mt-2 truncate">Value: {{ demoForm.value.tags | json }}</p>
          </div>
        </section>

        <!-- Case 3: Restricted Input (Alphanumeric) -->
        <section class="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-50 dark:border-gray-700 md:col-span-2">
           <div class="flex items-center space-x-3 text-purple-600">
             <span class="material-icons">verified_user</span>
             <div class="flex-1">
               <h3 class="text-lg font-bold">Strict Protocol ID</h3>
               <p class="text-xs text-gray-400">Restricted to Alphanumeric characters only</p>
             </div>
           </div>

           <app-generic-dropdown 
             label="New Protocol ID"
             [options]="idOptions()"
             [config]="restrictedConfig()"
             [(ngModel)]="selectedId">
           </app-generic-dropdown>

           <div class="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/50">
              <p class="text-xs font-medium text-purple-600 dark:text-purple-400">
                <span class="material-icons text-[14px] align-middle mr-1">info</span>
                Try adding a label with special characters like "ID#123" - the Add button will disable. Leading/Trailing spaces will be trimmed, and double spaces collapsed.
              </p>
           </div>
        </section>

      </div>

      <!-- Feature Highlight -->
      <div class="bg-indigo-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
         <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="space-y-4 max-w-md">
               <h4 class="text-2xl font-bold">Key Capabilities</h4>
               <ul class="space-y-2 opacity-90 text-sm">
                  <li class="flex items-center"><span class="material-icons text-sm mr-2">check_circle</span> Signal-based reactivity (Angular 20)</li>
                  <li class="flex items-center"><span class="material-icons text-sm mr-2">check_circle</span> Built-in search, sort, and add-new</li>
                  <li class="flex items-center"><span class="material-icons text-sm mr-2">check_circle</span> Automated space cleaning (trim & collapse)</li>
                  <li class="flex items-center"><span class="material-icons text-sm mr-2">check_circle</span> Configurable character constraints (Alpha, Numeric, Alphanumeric)</li>
               </ul>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
               <span class="text-xs font-bold uppercase tracking-widest opacity-70">Implementation Tip</span>
               <p class="text-sm mt-1">Bind this component to any observable stream or Signal for dynamic data loading.</p>
            </div>
         </div>
         <!-- Decorative Background -->
         <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DropdownDemoComponent {
  // Dummy Data
  userOptions = signal<DropdownOption[]>([
    { label: 'Dr. Sarah Smith', value: 'sarah_s' },
    { label: 'Prof. James Wilson', value: 'james_w' },
    { label: 'Nurse Elena Rodriguez', value: 'elena_r' },
    { label: 'Admin Support', value: 'admin' }
  ]);

  tagOptions = signal<DropdownOption[]>([
    { label: 'Urgent', value: 'urgent' },
    { label: 'Baseline', value: 'baseline' },
    { label: 'Follow-up Required', value: 'follow_up' },
    { label: 'Critical Data', value: 'critical' },
    { label: 'Pending Review', value: 'pending' }
  ]);

  idOptions = signal<DropdownOption[]>([
    { label: 'PRT-2024-X', value: 'prt_2024_x' },
    { label: 'CLIN-OBS-1', value: 'clin_obs_1' }
  ]);

  // Selected State
  selectedUser = signal<string | null>(null);
  selectedId = signal<string | null>(null);

  // Configs
  singleConfig = signal<DropdownConfig>({
    placeholder: 'Choose a researcher...',
    allowSearch: true,
    multiSelect: false,
    allowSort: true,
    allowAdd: true,
    addLabel: '+ Add Researcher'
  });

  multiConfig = signal<DropdownConfig>({
    placeholder: 'Apply tags...',
    allowSearch: true,
    multiSelect: true,
    allowSort: true,
    allowAdd: false
  });

  restrictedConfig = signal<DropdownConfig>({
    placeholder: 'Generate new ID...',
    allowSearch: true,
    allowAdd: true,
    addLabel: 'Create Protocol ID',
    allowedCharacters: 'alphanumeric'
  });

  // Reactive Form
  demoForm = new FormGroup({
    tags: new FormControl([], [Validators.required, Validators.minLength(1)])
  });

  tagError = signal<string | null>(null);

  onUserAdded(opt: DropdownOption) {
    console.log('New user added to the local pool:', opt);
  }

  submitForm() {
    if (this.demoForm.invalid) {
      this.tagError.set('Please select at least one tag');
    } else {
      this.tagError.set(null);
      alert('Form submitted successfully with: ' + JSON.stringify(this.demoForm.value));
    }
  }
}
