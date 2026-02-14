
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button [class]="classes()" (click)="onClick()">
       <ng-content></ng-content>
       {{ label() }}
    </button>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
    // Using Angular 20 (?) / latest input signals
    readonly type = input<'primary' | 'secondary' | 'danger'>('primary');
    readonly label = input<string>('Click me');

    // Output signal (example for signal-based components if supported, otherwise standard @Output)
    readonly clicked = output<void>();

    readonly classes = computed(() => {
        const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';
        switch (this.type()) {
            case 'primary': return `${base} bg-blue-600 text-white hover:bg-blue-700`;
            case 'secondary': return `${base} bg-gray-600 text-white hover:bg-gray-700`;
            case 'danger': return `${base} bg-red-600 text-white hover:bg-red-700`;
            default: return base;
        }
    });

    onClick() {
        this.clicked.emit();
    }
}
