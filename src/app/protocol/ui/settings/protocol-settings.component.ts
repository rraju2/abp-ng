
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProtocolStateService } from '../../data/protocol-state.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-protocol-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="lx-page animate-fade-in w-full max-w-3xl mx-auto p-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <span class="material-icons mr-2 text-indigo-500">settings_applications</span>
            Update Protocol
        </h2>

        <form [formGroup]="protocolForm" (ngSubmit)="updateForm()" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
            
            <!-- Protocol Title -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protocol Title</label>
                <input type="text" formControlName="title" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-shadow">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Study Type Selection (Dropdown) -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Study Phase</label>
                    <select formControlName="phase" 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="" disabled>Select Phase</option>
                        <option value="I">Phase I</option>
                        <option value="II">Phase II</option>
                        <option value="III">Phase III</option>
                        <option value="IV">Phase IV</option>
                        <option value="Observational">Observational</option>
                    </select>
                </div>

                <!-- Start Date (Date Picker) -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Planned Start Date</label>
                    <input type="date" formControlName="startDate"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
            </div>

            <!-- Status (Radio Buttons) -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Status</label>
                <div class="flex space-x-6">
                    <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" formControlName="status" value="Draft" class="text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700">
                        <span class="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">Draft Mode</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" formControlName="status" value="Active" class="text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700">
                        <span class="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">Active</span>
                    </label>
                </div>
            </div>

            <!-- Description -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Notes</label>
                <textarea formControlName="description" rows="3" 
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="submit" 
                        [disabled]="protocolForm.invalid || protocolForm.pristine"
                        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                    <span class="material-icons mr-2 text-sm">save</span>
                    Update Protocol
                </button>
            </div>

        </form>
    </div>
  `,
    styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProtocolSettingsComponent {
    fb = inject(FormBuilder);
    protocolState = inject(ProtocolStateService);
    router = inject(Router);

    protocolForm = this.fb.group({
        title: ['', Validators.required],
        phase: ['', Validators.required],
        startDate: ['', Validators.required],
        status: ['Draft', Validators.required],
        description: ['']
    });

    constructor() {
        const currentData = this.protocolState.protocolData();
        if (currentData) {
            this.protocolForm.patchValue(currentData);
        }
    }

    updateForm() {
        if (this.protocolForm.valid) {
            this.protocolState.updateProtocol(this.protocolForm.value as any);
            console.log('Updated Protocol:', this.protocolForm.value);
            alert('Protocol Updated Successfully');
        }
    }
}
