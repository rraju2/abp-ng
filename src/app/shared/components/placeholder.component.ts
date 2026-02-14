
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-placeholder',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-10 text-center">
      <h2 class="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
        {{ title() }}
      </h2>
      <p class="text-gray-500 mb-8">
        This feature is under development.
      </p>
      <div class="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm border border-gray-300 dark:border-gray-600">
        Current Route: <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ currentPath() }}</span>
      </div>
    </div>
  `
})
export class PlaceholderComponent {
    route = inject(ActivatedRoute);
    router = inject(Router);

    currentPath = computed(() => this.router.url);

    title = computed(() => {
        const url = this.currentPath();
        const parts = url.split('/').filter(Boolean);
        if (parts.length > 1) {
            return parts[parts.length - 1].toUpperCase().replace('-', ' ');
        }
        return 'Feature Module';
    });
}
