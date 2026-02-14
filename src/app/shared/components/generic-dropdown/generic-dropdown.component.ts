
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  forwardRef,
  ElementRef,
  HostListener,
  inject,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownOption, DropdownConfig } from './dropdown.models';

@Component({
  selector: 'app-generic-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericDropdownComponent),
      multi: true
    }
  ],
  template: `
    <div class="lx-dropdown relative w-full" 
         [class.lx-disabled]="disabled()"
         (keydown)="onKeyDown($event)">
      <!-- Label (Optional) -->
      @if (label) {
        <label [id]="labelId" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          {{ label }}
          @if (config.required) {
            <span class="text-rose-500 ml-0.5">*</span>
          }
        </label>
      }

      <!-- Select Hook -->
      <div (click)="toggleDropdown()"
           [attr.tabindex]="disabled() ? -1 : 0"
           [attr.aria-haspopup]="'listbox'"
           [attr.aria-expanded]="isOpen()"
           [attr.aria-labelledby]="labelId"
           role="combobox"
           class="lx-select-trigger flex items-center justify-between w-full bg-white dark:bg-gray-800 border-2 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
           [class.border-indigo-500]="isOpen()"
           [class.border-gray-200]="!isOpen() && !error"
           [class.dark:border-gray-700]="!isOpen() && !error"
           [class.border-rose-500]="error"
           [class.shadow-xl]="isOpen()"
           [class.shadow-indigo-500/10]="isOpen()">
        
        <div class="flex flex-wrap gap-1 items-center overflow-hidden">
          @if (selectedOptions().length === 0) {
            <span class="text-gray-400 dark:text-gray-500 truncate">{{ config.placeholder || 'Select option...' }}</span>
          } @else {
            @if (config.multiSelect) {
              @for (opt of selectedOptions(); track opt.value) {
                <span class="inline-flex items-center bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg text-xs font-bold animate-fade-in border border-indigo-100 dark:border-indigo-800">
                  {{ opt.label }}
                  <span (click)="removeOption($event, opt)" 
                        role="button" aria-label="Remove item"
                        class="material-icons text-[14px] ml-1 hover:text-indigo-800 cursor-pointer">close</span>
                </span>
              }
            } @else {
              <span class="text-gray-900 dark:text-white font-medium truncate">{{ selectedOptions()[0].label }}</span>
            }
          }
        </div>

        <span class="material-icons transition-transform duration-300 text-gray-400" [class.rotate-180]="isOpen()">expand_more</span>
      </div>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div class="absolute left-0 right-0 mt-2 z-[999] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
          
          <!-- Search & Controls -->
          @if (config.allowSearch) {
            <div class="p-3 border-b border-gray-50 dark:border-gray-700/50">
              <div class="relative">
                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                <input #searchInput type="text"
                       [value]="searchQuery()"
                       (input)="searchQuery.set(searchInput.value)"
                       (keydown.enter)="handleSearchEnter($event)"
                       [placeholder]="config.searchPlaceholder || 'Filter items...'"
                       class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
              </div>
            </div>
          }

          <!-- Options List -->
          <ul role="listbox" 
              class="max-h-60 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            @for (opt of filteredOptions(); track opt.value; let i = $index) {
              <li (click)="selectOption(opt)"
                  role="option"
                  [attr.aria-selected]="isSelected(opt)"
                  class="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 group/item"
                  [class.bg-indigo-50/50]="isSelected(opt) || i === focusedIndex()"
                  [class.dark:bg-indigo-900/20]="isSelected(opt) || i === focusedIndex()">
                <div class="flex items-center">
                  @if (config.multiSelect) {
                    <div class="w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all"
                         [class.bg-indigo-600]="isSelected(opt)"
                         [class.border-indigo-600]="isSelected(opt)"
                         [class.border-gray-300]="!isSelected(opt)">
                      @if (isSelected(opt)) {
                        <span class="material-icons text-[14px] text-white">check</span>
                      }
                    </div>
                  }
                  <span class="text-sm transition-colors" [class.text-indigo-600]="isSelected(opt)" [class.dark:text-indigo-400]="isSelected(opt)" [class.text-gray-700]="!isSelected(opt)" [class.dark:text-gray-300]="!isSelected(opt)">
                    {{ opt.label }}
                  </span>
                </div>
                @if (!config.multiSelect && isSelected(opt)) {
                  <span class="material-icons text-indigo-500 text-sm">check</span>
                }
              </li>
            } @empty {
              <li class="px-4 py-8 text-center bg-gray-50/50 dark:bg-gray-900/50 flex flex-col items-center">
                 <span class="material-icons text-gray-300 text-3xl mb-2">find_in_page</span>
                 <p class="text-xs text-gray-400 font-medium">No results found for "{{ searchQuery() }}"</p>
                 
                 @if (config.allowAdd && searchQuery()) {
                   <div class="mt-4 w-full px-4">
                     @if (!isSearchQueryValid() && config.allowedCharacters !== 'all') {
                       <p class="text-[10px] text-rose-500 font-bold uppercase tracking-tighter mb-2">
                         Invalid format: Only {{ config.allowedCharacters }} allowed
                       </p>
                     }
                     <button (click)="addNewItem()" 
                             [disabled]="!canAdd()"
                             class="w-full px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">
                       {{ config.addLabel || '+ Add as New Item' }}
                     </button>
                   </div>
                 }
              </li>
            }
          </ul>
        </div>
      }

      <!-- Error Message -->
      @if (error) {
        <p class="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-fade-in flex items-center">
          <span class="material-icons text-[14px] mr-1">error_outline</span>
          {{ error }}
        </p>
      }
    </div>

    <!-- Success Modal (Appears when adding item) -->
    @if (showSuccess()) {
      <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center scale-up">
           <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span class="material-icons text-3xl">check_circle</span>
           </div>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Item Added Successfully</h3>
           <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">"{{ lastAdded() }}" has been added and selected.</p>
           <button (click)="showSuccess.set(false)" 
                   class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
             Great!
           </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    
    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { border-radius: 10px; }
    .lx-disabled { opacity: 0.6; pointer-events: none; grayscale: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDropdownComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  labelId = `dropdown-label-${Math.random().toString(36).substr(2, 9)}`;

  @Input() options: DropdownOption[] = [];
  @Input() config: DropdownConfig = {
    placeholder: 'Select options',
    allowSearch: true,
    multiSelect: false,
    allowSort: true,
    allowAdd: true,
    showSuccessModal: true
  };
  @Input() label: string = '';
  @Input() error: string | null = null;

  @Output() optionAdded = new EventEmitter<DropdownOption>();
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = signal(false);
  searchQuery = signal('');
  disabled = signal(false);
  focusedIndex = signal(-1);

  // State for adding new item
  showSuccess = signal(false);
  lastAdded = signal('');

  // Form Value State
  private _value = signal<any[]>([]); // Always handle internally as an array

  selectedOptions = computed(() => {
    const val = this._value();
    return this.options.filter((o: DropdownOption) => val.includes(o.value));
  });

  filteredOptions = computed(() => {
    let opts = [...this.options];
    const query = this.searchQuery().toLowerCase();

    if (query) {
      opts = opts.filter(o => o.label.toLowerCase().includes(query));
    }

    if (this.config.allowSort) {
      opts.sort((a, b) => a.label.localeCompare(b.label));
    }

    return opts;
  });

  // ControlValueAccessor methods
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this._value.set([]);
    } else if (Array.isArray(value)) {
      this._value.set(value);
    } else {
      this._value.set([value]);
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  toggleDropdown() {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
      if (this.isOpen()) {
        this.focusedIndex.set(-1);
        // Focus search input on next tick
        setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
      } else {
        this.onTouched();
      }
    }
  }

  selectOption(option: DropdownOption) {
    if (option.disabled) return;

    if (this.config.multiSelect) {
      this._value.update(val => {
        if (val.includes(option.value)) {
          return val.filter(v => v !== option.value);
        } else {
          return [...val, option.value];
        }
      });
    } else {
      this._value.set([option.value]);
      this.isOpen.set(false);
    }

    this.emitValue();
  }

  removeOption(event: Event, option: DropdownOption) {
    event.stopPropagation();
    this._value.update(val => val.filter(v => v !== option.value));
    this.emitValue();
  }

  isSelected(option: DropdownOption): boolean {
    return this._value().includes(option.value);
  }

  emitValue() {
    const rawVal = this._value();
    const finalVal = this.config.multiSelect ? rawVal : (rawVal[0] ?? null);
    this.onChange(finalVal);
    this.selectionChange.emit(finalVal);
  }

  cleanedSearchQuery = computed(() => {
    return this.searchQuery()
      .trim()
      .replace(/\s+/g, ' ');
  });

  isSearchQueryValid = computed(() => {
    const query = this.cleanedSearchQuery();
    if (!query) return false;

    const mode = this.config.allowedCharacters || 'all';
    switch (mode) {
      case 'alpha': return /^[a-zA-Z\s]+$/.test(query);
      case 'numeric': return /^[0-9\s]+$/.test(query);
      case 'alphanumeric': return /^[a-zA-Z0-9\s]+$/.test(query);
      default: return true;
    }
  });

  canAdd = computed(() => {
    if (!this.config.allowAdd || !this.isSearchQueryValid()) return false;

    // Check for duplicates
    const query = this.cleanedSearchQuery().toLowerCase();
    const exists = this.options.some(o => o.label.toLowerCase() === query);
    return !exists;
  });

  addNewItem() {
    if (!this.canAdd()) return;

    const label = this.cleanedSearchQuery();
    const newValue = label.toLowerCase().replace(/ /g, '_');
    const newOpt: DropdownOption = { label, value: newValue };

    // Update parent options
    this.options = [...this.options, newOpt];

    // Select it
    this.selectOption(newOpt);

    // Interaction
    this.lastAdded.set(label);
    if (this.config.showSuccessModal) {
      this.showSuccess.set(true);
    }

    this.searchQuery.set('');
    this.optionAdded.emit(newOpt);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.isOpen()) {
          this.toggleDropdown();
          event.preventDefault();
        } else if (this.focusedIndex() !== -1) {
          this.selectOption(this.filteredOptions()[this.focusedIndex()]);
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (!this.isOpen()) {
          this.toggleDropdown();
        } else {
          this.focusedIndex.update(i => Math.min(i + 1, this.filteredOptions().length - 1));
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (this.isOpen()) {
          this.focusedIndex.update(i => Math.max(i - 1, 0));
        }
        event.preventDefault();
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
      case 'Tab':
        if (this.isOpen()) {
          this.isOpen.set(false);
        }
        break;
    }
  }

  handleSearchEnter(event: Event) {
    event.preventDefault();
    if (this.filteredOptions().length > 0) {
      this.selectOption(this.filteredOptions()[0]);
    } else if (this.config.allowAdd) {
      this.addNewItem();
    }
  }
}
