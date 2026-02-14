
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { MainLayoutComponent } from './app/layout/main/main-layout.component';
import { HomeComponent } from './app/home/ui/home.component';
import { PlaceholderComponent } from './app/shared/components/placeholder.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './app/core/auth/login.component';
import { ProtocolDashboardComponent } from './app/protocol/ui/protocol-dashboard.component';
import { ProtocolSettingsComponent } from './app/protocol/ui/settings/protocol-settings.component';
import { TabletDesignComponent } from './app/tablet/ui/tablet-design.component';

const routes: Routes = [
    // Authentication
    { path: 'login', component: LoginComponent },

    // App Layout
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },

            // Portal Context
            {
                path: 'portal',
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: HomeComponent },
                    { path: 'identity', loadChildren: () => import('./app/identity/identity.routes').then(m => m.IDENTITY_ROUTES) },
                    { path: 'reports', component: PlaceholderComponent },
                    { path: 'settings', component: PlaceholderComponent },
                    {
                        path: 'dropdown-demo',
                        loadComponent: () => import('./app/shared/components/generic-dropdown/dropdown-demo.component').then(m => m.DropdownDemoComponent)
                    }
                ]
            },

            // Protocol Context
            {
                path: 'protocol',
                children: [
                    { path: '', redirectTo: 'design', pathMatch: 'full' },
                    { path: 'design', component: ProtocolDashboardComponent },
                    { path: 'sites', component: PlaceholderComponent },
                    { path: 'settings', component: ProtocolSettingsComponent },
                    { path: 'visits', component: PlaceholderComponent },
                    { path: 'workflows', component: PlaceholderComponent }
                ]
            },

            // Tablet Context
            {
                path: 'tablet',
                children: [
                    { path: '', redirectTo: 'design', pathMatch: 'full' },
                    { path: 'design', component: TabletDesignComponent },
                    { path: 'subject', component: PlaceholderComponent },
                    { path: 'sync', component: PlaceholderComponent },
                    { path: 'devices', component: PlaceholderComponent }
                ]
            },

            // Mobile Context
            {
                path: 'mobile',
                children: [
                    { path: '', redirectTo: 'diary', pathMatch: 'full' },
                    { path: 'diary', component: PlaceholderComponent },
                    { path: 'notifications', component: PlaceholderComponent },
                    { path: 'profile', component: PlaceholderComponent }
                ]
            }
        ]
    }
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(
            routes,
            withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
            withViewTransitions()
        ),
        provideHttpClient(),
        provideAnimationsAsync()
    ]
}).catch(err => console.error(err));
