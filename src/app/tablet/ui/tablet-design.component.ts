import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabletStateService } from '../data/tablet-state.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-tablet-design',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="lx-tablet-designer h-screen-minus-header flex overflow-hidden">
      
      <!-- Main Design Canvas -->
      <div class="flex-1 overflow-y-auto p-8 relative bg-gray-50 dark:bg-gray-900/40">
        
        <div class="max-w-4xl mx-auto space-y-8">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {{ tabletState.selectedSectionId() ? 'Section Designer' : 'Tablet Desktop' }}
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400">
                        {{ tabletState.selectedSectionId() ? 'Refining section workflow' : 'Architect your clinical session workflow' }}
                    </p>
                </div>
                @if (!tabletState.selectedSectionId()) {
                    <button (click)="tabletState.openCreateModal()" 
                            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-all transform hover:-translate-y-1 font-bold flex items-center">
                        <span class="material-icons mr-2">add</span> Create Section
                    </button>
                } @else {
                    <button (click)="tabletState.selectSection(null)" 
                            class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-bold flex items-center">
                        <span class="material-icons mr-2">arrow_back</span> Back to Desktop
                    </button>
                }
            </header>

            <!-- Sections Container -->
            <div class="grid grid-cols-1 gap-6">
                @for (section of displaySections(); track section.id) {
                    <div (click)="tabletState.selectSection(section.id)"
                         [class.ring-4]="tabletState.selectedSectionId() === section.id"
                         [class.ring-indigo-500/30]="tabletState.selectedSectionId() === section.id"
                         [class.border-indigo-500]="tabletState.selectedSectionId() === section.id"
                         class="lx-section-widget group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent cursor-pointer relative overflow-hidden">
                        
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex items-center">
                                <span class="material-icons mr-3 p-3 rounded-2xl transition-colors"
                                      [ngClass]="section.color + ' text-white'">view_quilt</span>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ section.label }}</h3>
                                    <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">Section Component</p>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button (click)="$event.stopPropagation()" class="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                    <span class="material-icons">settings</span>
                                </button>
                                <button (click)="$event.stopPropagation()" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <span class="material-icons">delete_outline</span>
                                </button>
                            </div>
                        </div>

                        <!-- Screens Builder -->
                        <div class="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
                             <div class="flex flex-wrap gap-4 items-center">
                                 @for (screen of section.screens; track screen.id) {
                                     <div class="w-24 h-32 rounded-lg bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-gray-800 dark:text-white space-y-2 border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in group/screen relative">
                                          <span class="material-icons text-xl" [ngClass]="section.color.replace('bg-', 'text-')">monitor</span>
                                          <span class="text-[10px] uppercase font-bold text-center px-1 truncate w-full">{{ screen.label }}</span>
                                          
                                          <button (click)="$event.stopPropagation(); tabletState.removeScreen(section.id, screen.id)"
                                                  class="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity transform hover:scale-110 shadow-lg">
                                              <span class="material-icons text-[12px]">close</span>
                                          </button>
                                     </div>
                                 }
                                 
                                 <button (click)="$event.stopPropagation(); tabletState.openScreenModal(section.id)" 
                                         class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center transition-all transform hover:scale-110"
                                         [ngClass]="section.color.replace('bg-', 'text-')">
                                     <span class="material-icons">add</span>
                                 </button>
                                 <span class="text-xs text-gray-400 font-medium whitespace-nowrap">Add Screen to {{ section.label }}</span>
                             </div>
                        </div>

                        <!-- Accent Bar -->
                        <div class="absolute left-0 top-0 w-1.5 h-full transition-all"
                             [ngClass]="section.color"
                             [class.w-3]="tabletState.selectedSectionId() === section.id"></div>
                    </div>
                } @empty {
                    @if (!tabletState.selectedSectionId()) {
                        <div (click)="tabletState.openCreateModal()" class="flex flex-col items-center justify-center p-20 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all cursor-pointer">
                            <span class="material-icons text-6xl mb-4">post_add</span>
                            <p class="text-xl font-bold">No sections created yet</p>
                            <p class="text-sm">Click here to add your first design section</p>
                        </div>
                    } @else {
                        <div (click)="tabletState.selectSection(null)" class="flex flex-col items-center justify-center p-20 bg-gray-100 dark:bg-gray-800 rounded-3xl text-gray-400 cursor-pointer">
                            <span class="material-icons text-6xl mb-4">error_outline</span>
                            <p class="text-xl font-bold">Section not found</p>
                            <p class="text-sm">Return to desktop to select another section</p>
                        </div>
                    }
                }
            </div>
        </div>
      </div>

      <!-- Right Side Properties Panel -->
      @if (tabletState.isPropertiesOpen()) {
        <aside class="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-2xl animate-slide-left relative z-20">
            <header class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h4 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-widest">Properties</h4>
                <button (click)="tabletState.closeProperties()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <span class="material-icons">close</span>
                </button>
            </header>

            <div class="flex-1 overflow-y-auto p-6 space-y-8">
                @if (tabletState.selectedSection(); as section) {
                    <!-- Label Edit -->
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Section Identity</label>
                            @if (!tabletState.isEditingLabel()) {
                                <button (click)="tabletState.setEditingLabel(true)" 
                                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-indigo-500 transition-colors">
                                    <span class="material-icons text-sm">edit</span>
                                </button>
                            }
                        </div>
                        <div class="relative group">
                            @if (tabletState.isEditingLabel()) {
                                <input #labelInput type="text" 
                                       [value]="section.label"
                                       (blur)="tabletState.setEditingLabel(false)"
                                       (keydown.enter)="tabletState.setEditingLabel(false)"
                                       (input)="tabletState.updateSectionLabel(section.id, labelInput.value)"
                                       autofocus
                                       class="w-full bg-gray-50 dark:bg-gray-900 border border-indigo-500 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none">
                                <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 text-sm">check</span>
                            } @else {
                                <div class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium cursor-default">
                                    {{ section.label }}
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Appearance -->
                    <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Styling</label>
                        <div class="grid grid-cols-4 gap-2">
                             @for (color of ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500', 'bg-slate-700']; track color) {
                                 <button (click)="tabletState.updateSectionColor(section.id, color)"
                                         [class]="color + ' w-full aspect-square rounded-lg ring-offset-2 transition-all transform active:scale-95'"
                                         [class.ring-2]="section.color === color"
                                         [class.ring-gray-400]="section.color === color"></button>
                             }
                        </div>
                    </div>

                    <!-- Layout Settings -->
                     <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Widget Layout</label>
                        <div class="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
                            <button class="flex-1 py-2 text-xs font-bold bg-white dark:bg-gray-800 shadow-sm rounded-md text-indigo-600">Grid</button>
                            <button class="flex-1 py-2 text-xs font-bold text-gray-500">List</button>
                        </div>
                    </div>
                } @else {
                    <div class="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                         <span class="material-icons text-5xl">ads_click</span>
                         <p class="text-sm">Select a section to edit its properties</p>
                    </div>
                }
            </div>

            <footer class="p-6 border-t border-gray-100 dark:border-gray-700">
                <button (click)="tabletState.closeProperties()" 
                        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95">
                    Save Changes
                </button>
            </footer>
        </aside>
      }

      <!-- Create Section Modal -->
      @if (tabletState.isCreateModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
             <div (click)="tabletState.closeCreateModal()" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
             <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden transform transition-all">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Section</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Give your design section a meaningful name.</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Section Label</label>
                        <input #sectionLabelInput type="text" placeholder="e.g. ECG Analysis" 
                               class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500">
                    </div>

                    <div class="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button (click)="tabletState.closeCreateModal()" 
                                class="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300">
                            Cancel
                        </button>
                        <button (click)="tabletState.addSection(sectionLabelInput.value)" 
                                class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95">
                            Add Section
                        </button>
                    </div>
                </div>
             </div>
        </div>
      }

      <!-- Create Screen Modal -->
      @if (tabletState.isScreenModalOpen()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
             <div (click)="tabletState.closeScreenModal()" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
             <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden transform transition-all">
                <div class="mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Screen</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a screen to your workflow section.</p>
                </div>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500">Screen Label</label>
                        <input #screenLabelInput type="text" placeholder="e.g. Baseline Prep" 
                               class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500">
                    </div>

                    <div class="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button (click)="tabletState.closeScreenModal()" 
                                class="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300">
                            Cancel
                        </button>
                        <button (click)="tabletState.addScreen(screenLabelInput.value)" 
                                class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95">
                            Add Screen
                        </button>
                    </div>
                </div>
             </div>
        </div>
      }

    </div>
  `,
    styles: [`
    .h-screen-minus-header { height: calc(100vh - 64px); }
    .animate-slide-left { animation: slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes slideLeft { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabletDesignComponent {
    tabletState = inject(TabletStateService);
    route = inject(ActivatedRoute);

    displaySections = computed(() => {
        const selectedId = this.tabletState.selectedSectionId();
        const allSections = this.tabletState.sections();

        if (selectedId) {
            return allSections.filter(s => s.id === selectedId);
        }
        return allSections;
    });

    constructor() {
        // Sync selected section with URL query parameters
        this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
            const id = params['id'];
            if (id !== this.tabletState.selectedSectionId()) {
                this.tabletState.selectSection(id || null);
            }
        });
    }
}
