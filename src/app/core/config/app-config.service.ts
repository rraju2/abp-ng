
import { Injectable, signal, computed } from '@angular/core';

export interface AppConfig {
    appName: string;
    version: string;
    theme: 'light' | 'dark' | 'system';
    leptonXOptions: {
        style: 'modern' | 'classic';
        layout: 'side-menu' | 'top-menu';
    };
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    // Signal for app configuration
    private configSignal = signal<AppConfig>({
        appName: 'Vitalograph',
        version: '1.0.0',
        theme: 'system',
        leptonXOptions: {
            style: 'modern',
            layout: 'side-menu'
        }
    });

    // Read-only signal for consumers
    readonly config = this.configSignal.asReadonly();

    // Computed signal examples
    readonly isDarkMode = computed(() => this.config().theme === 'dark');
    readonly layoutStyle = computed(() => this.config().leptonXOptions.style);

    updateTheme(newTheme: 'light' | 'dark' | 'system') {
        this.configSignal.update(cfg => ({ ...cfg, theme: newTheme }));
    }

    updateLayoutFormat(layout: 'side-menu' | 'top-menu') {
        this.configSignal.update(cfg => ({
            ...cfg,
            leptonXOptions: { ...cfg.leptonXOptions, layout }
        }));
    }
}
