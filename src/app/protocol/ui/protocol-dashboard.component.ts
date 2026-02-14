import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProtocolStateService } from '../data/protocol-state.service';
import { GenericDropdownComponent } from '../../shared/components/generic-dropdown/generic-dropdown.component';
import { DropdownOption, DropdownConfig } from '../../shared/components/generic-dropdown/dropdown.models';

@Component({
    selector: 'app-protocol-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, GenericDropdownComponent],
    template: `
    <div class="lx-dashboard animate-fade-in relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      <!-- Welcome Hero Section -->
      <header class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 shadow-2xl">
          <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div class="space-y-4 max-w-2xl">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 uppercase tracking-wider">
                      Designer Workspace
                  </span>
                  <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Welcome back, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-200">Vitalograph Designer</span>
                  </h1>
                  <p class="text-indigo-100/80 text-lg leading-relaxed">
                      Optimize clinical research with precision study designs. Your tools for protocol architecture and site management are ready.
                  </p>
              </div>
              <div class="mt-8 md:mt-0 flex gap-4">
                  <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                      <div class="text-3xl font-bold text-white">12</div>
                      <div class="text-xs text-indigo-200 uppercase mt-1">Protocols</div>
                  </div>
                   <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[100px]">
                      <div class="text-3xl font-bold text-white">84%</div>
                      <div class="text-xs text-indigo-200 uppercase mt-1">Approval</div>
                  </div>
              </div>
          </div>
          <!-- Decorative SVGs -->
          <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </header>

      <!-- Main Action Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Open Protocols Card -->
        <article class="lx-card group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between overflow-hidden">
           <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span class="material-icons text-9xl">folder_special</span>
           </div>
           
           <div>
              <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <span class="material-icons text-3xl">folder_open</span>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  Open Protocols
                  <span class="ml-2 px-2 py-0.5 text-[10px] bg-green-100 text-green-700 rounded uppercase font-bold tracking-tighter">Drafts Available</span>
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Seamlessly navigate through your existing clinical study architectures. Review, edit, and finalize your ongoing research designs.
              </p>
           </div>
           
           <button class="flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300 group/btn">
               <span class="flex items-center"><span class="material-icons mr-2">collections_bookmark</span> Open Protocol</span>
               <span class="material-icons transform group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
           </button>
        </article>

        <!-- Create Protocol Card -->
        <article class="lx-card group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between overflow-hidden">
           <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <span class="material-icons text-9xl">auto_awesome</span>
           </div>

           <div>
              <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <span class="material-icons text-3xl">add_circle_outline</span>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Create Protocol</h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  Start an innovative study design from a clean slate or optimized templates. Orchestrate visits, workflows, and global site parameters.
              </p>
           </div>
           
           <button (click)="openForm()" class="flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 text-emerald-600 dark:text-emerald-300 font-bold hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all duration-300 group/btn">
               <span class="flex items-center"><span class="material-icons mr-2">create_new_folder</span> Create Protocol</span>
               <span class="material-icons transform group-hover/btn:rotate-90 transition-transform">add</span>
           </button>
        </article>
      </section>

      <!-- Secondary Info Section -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                  <span class="material-icons mr-2 text-indigo-500">history</span> Recent Activity
              </h4>
              <div class="space-y-6">
                   @for (item of [1,2,3]; track item) {
                       <div class="flex items-center space-x-4 group cursor-pointer">
                           <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                               <span class="material-icons text-sm text-gray-500 group-hover:text-indigo-600">edit</span>
                           </div>
                           <div class="flex-1">
                               <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">Update on Protocol #PH3-CARDIO</p>
                               <p class="text-xs text-gray-400">Modified by you &middot; 2 hours ago</p>
                           </div>
                           <span class="material-icons text-gray-300 md:opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                       </div>
                   }
              </div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
              <div class="relative z-10">
                  <h4 class="text-lg font-bold mb-4">Designer Tip</h4>
                  <p class="text-white/80 text-sm leading-relaxed mb-6">
                      Did you know you can now duplicate visit schedules across multiple sites using the Site Management tool?
                  </p>
                  <button class="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                      Learn More
                  </button>
              </div>
              <span class="material-icons absolute -bottom-6 -right-6 text-9xl text-white/10 rotate-12">lightbulb</span>
          </div>
      </section>

      <!-- Create Protocol Modal Form -->
      @if (isFormOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
             <!-- Backdrop -->
             <div (click)="closeForm()" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>
             
             <!-- Modal Content -->
             <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
                
                <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <span class="material-icons mr-2 text-emerald-500">design_services</span>
                            Create New Protocol
                        </h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-bold">Standard Study Template</p>
                    </div>
                    <button (click)="closeForm()" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
                        <span class="material-icons">close</span>
                    </button>
                </div>

                <form [formGroup]="protocolForm" (ngSubmit)="submitForm()" class="p-8 space-y-6">
                    
                    <!-- Protocol Title -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Protocol Title & ID</label>
                        <div class="relative group">
                            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">badge</span>
                            <input type="text" formControlName="title" placeholder="Enter protocol name..." 
                               class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:bg-gray-900 dark:text-white transition-all outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Therapeutic Area (New Dropdown) -->
                        <div class="md:col-span-2">
                            <app-generic-dropdown 
                                label="Therapeutic Area"
                                [options]="taOptions()"
                                [config]="taConfig()"
                                formControlName="therapeuticArea">
                            </app-generic-dropdown>
                        </div>

                        <!-- Site Capabilities (Multi-Select) -->
                        <div class="md:col-span-2">
                            <app-generic-dropdown 
                                label="Required Site Capabilities"
                                [options]="capabilityOptions()"
                                [config]="multiConfig()"
                                formControlName="siteCapabilities"
                                [error]="capabilityError()">
                            </app-generic-dropdown>
                        </div>

                        <!-- Study Phase (Updated to Generic Dropdown) -->
                        <div>
                            <app-generic-dropdown 
                                label="Study Phase"
                                [options]="phaseOptions()"
                                [config]="phaseConfig()"
                                formControlName="phase">
                            </app-generic-dropdown>
                        </div>

                        <!-- Date Picker -->
                        <div class="space-y-2">
                            <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Live Date</label>
                            <div class="relative group">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">calendar_today</span>
                                <input type="date" formControlName="startDate"
                                       class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:bg-gray-900 dark:text-white transition-all outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Status Selection -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Initialization Mode</label>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="relative flex items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:border-indigo-500 transition-all group overflow-hidden">
                                <input type="radio" formControlName="status" value="Draft" class="sr-only peer">
                                <div class="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                <span class="material-icons text-gray-400 peer-checked:text-indigo-600 mr-2 z-10 transition-colors">edit_document</span>
                                <span class="text-sm font-bold text-gray-700 dark:text-gray-300 z-10 peer-checked:text-indigo-600 transition-colors">Draft Mode</span>
                            </label>
                            <label class="relative flex items-center p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 cursor-pointer hover:border-emerald-500 transition-all group overflow-hidden">
                                <input type="radio" formControlName="status" value="Active" class="sr-only peer">
                                <div class="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                <span class="material-icons text-gray-400 peer-checked:text-emerald-600 mr-2 z-10 transition-colors">bolt</span>
                                <span class="text-sm font-bold text-gray-700 dark:text-gray-300 z-10 peer-checked:text-emerald-600 transition-colors">Immediate Live</span>
                            </label>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Scope & Objectives</label>
                        <textarea formControlName="description" rows="3" placeholder="Provide context for clinical researchers..."
                                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:bg-gray-900 dark:text-white transition-all outline-none"></textarea>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" (click)="closeForm()" 
                                class="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            Discard
                        </button>
                        <button type="submit" 
                                [disabled]="protocolForm.invalid"
                                class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 active:scale-95 font-bold disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">
                            Build Protocol
                        </button>
                    </div>

                </form>
             </div>
        </div>
      }

    </div>
  `,
    styles: [`
    .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolDashboardComponent {
    fb = inject(FormBuilder);
    router = inject(Router);
    protocolState = inject(ProtocolStateService);

    isFormOpen = signal(false);

    // Dropdown Options
    phaseOptions = signal<DropdownOption[]>([
        { label: 'Phase I', value: 'I' },
        { label: 'Phase II', value: 'II' },
        { label: 'Phase III', value: 'III' },
        { label: 'Phase IV', value: 'IV' },
        { label: 'Observational', value: 'Observational' }
    ]);

    taOptions = signal<DropdownOption[]>([
        { label: 'Cardiovascular', value: 'cardio' },
        { label: 'Oncology', value: 'oncology' },
        { label: 'Respiratory', value: 'respiratory' },
        { label: 'Neurology', value: 'neurology' },
        { label: 'Immunology', value: 'immunology' }
    ]);

    // Configs
    phaseConfig = signal<DropdownConfig>({
        placeholder: 'Select Phase...',
        allowSearch: false,
        multiSelect: false,
        allowSort: false,
        allowAdd: false
    });

    taConfig = signal<DropdownConfig>({
        placeholder: 'Select Therapeutic Area...',
        allowSearch: true,
        multiSelect: false,
        allowSort: true,
        allowAdd: true,
        addLabel: '+ Add Area',
        allowedCharacters: 'alpha',
        required: true
    });

    multiConfig = signal<DropdownConfig>({
        placeholder: 'Select required capabilities...',
        allowSearch: true,
        multiSelect: true,
        allowSort: true,
        allowAdd: false
    });

    capabilityOptions = signal<DropdownOption[]>([
        { label: 'ECG Recording', value: 'ecg' },
        { label: 'Spirometry', value: 'spirometry' },
        { label: 'Blood Lab', value: 'blood_lab' },
        { label: 'Imaging (MRI/CT)', value: 'imaging' },
        { label: 'Cold Storage', value: 'cold_storage' }
    ]);

    protocolForm = this.fb.group({
        title: ['', Validators.required],
        phase: ['', Validators.required],
        therapeuticArea: [''],
        siteCapabilities: [[] as string[], [Validators.required, Validators.minLength(1)]],
        startDate: ['', Validators.required],
        status: ['Draft', Validators.required],
        description: ['']
    });

    capabilityError = computed(() => {
        const ctrl = this.protocolForm.get('siteCapabilities');
        return ctrl?.touched && ctrl?.invalid ? 'Select at least one capability' : null;
    });

    openForm() {
        this.isFormOpen.set(true);
    }

    closeForm() {
        this.isFormOpen.set(false);
        this.protocolForm.reset();
        this.protocolForm.patchValue({ status: 'Draft', siteCapabilities: [] });
    }

    submitForm() {
        if (this.protocolForm.valid) {
            this.protocolState.setProtocol(this.protocolForm.value as any);
            this.closeForm();
            this.router.navigate(['/protocol/sites']);
        }
    }
}
