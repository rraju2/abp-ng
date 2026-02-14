
import { Injectable, signal, computed, inject } from '@angular/core';

export type AppContext = 'Protocol' | 'Tablet' | 'Mobile' | 'Portal';

export interface MenuItem {
    label: string;
    icon: string;
    route: string;
    queryParams?: any;
    action?: () => void;
    exact?: boolean;
    disabledActive?: boolean;
}

import { AuthService } from '../../core/auth/auth.service';
import { TabletStateService } from '../../tablet/data/tablet-state.service';

@Injectable({
    providedIn: 'root'
})
export class LayoutStateService {
    private authService = inject(AuthService);
    private tabletState = inject(TabletStateService);

    // --- Sidebar State ---
    private _isSidebarOpen = signal(true);
    private _isSidebarCollapsed = signal(false);
    private _isMobileView = signal(window.innerWidth < 768);

    readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
    readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();
    readonly isMobile = this._isMobileView.asReadonly();

    readonly layoutClasses = computed(() => ({
        'lx-sidebar-open': this.isSidebarOpen(),
        'lx-sidebar-collapsed': this.isSidebarCollapsed(),
        'lx-mobile': this.isMobile()
    }));

    // --- Context/Tab State ---
    private _currentContext = signal<AppContext>('Portal'); // Default to Portal or Protocol
    readonly currentContext = this._currentContext.asReadonly();

    // --- Navigation Data ---
    private readonly designerMenus: Record<AppContext, MenuItem[]> = {
        'Protocol': [
            { label: 'Designer', icon: 'edit_note', route: '/protocol/design' },
            { label: 'Site Management', icon: 'location_city', route: '/protocol/sites' },
            { label: 'Protocol Settings', icon: 'settings_applications', route: '/protocol/settings' }
        ],
        'Tablet': [
            { label: 'Tablet Desktop', icon: 'tablet_mac', route: '/tablet/design', exact: true },
            { label: 'Create Section', icon: 'add_box', route: '/tablet/design', action: () => this.tabletState.openCreateModal(), disabledActive: true }
        ],
        'Mobile': [
            { label: 'My Diary', icon: 'book', route: '/mobile/diary' },
            { label: 'Notifications', icon: 'notifications', route: '/mobile/notifications' },
            { label: 'Profile', icon: 'account_circle', route: '/mobile/profile' }
        ],
        'Portal': [
            { label: 'Dashboard', icon: 'dashboard', route: '/portal/dashboard' },
            { label: 'Identity Mgmt', icon: 'people', route: '/portal/identity/users' },
            { label: 'Dropdown Demo', icon: 'ballot', route: '/portal/dropdown-demo' },
            { label: 'Reports', icon: 'analytics', route: '/portal/reports' },
            { label: 'Settings', icon: 'settings', route: '/portal/settings' }
        ]
    };

    private readonly standardMenu: MenuItem[] = [
        { label: 'Home', icon: 'home', route: '/home' },
        { label: 'Dashboard', icon: 'dashboard', route: '/portal/dashboard' },
        { label: 'My Profile', icon: 'person', route: '/mobile/profile' },
        { label: 'Settings', icon: 'settings', route: '/portal/settings' }
    ];

    // Computed Menu based on Role + Selected Context
    readonly currentMenu = computed(() => {
        if (!this.authService.isDesigner()) {
            return this.standardMenu;
        }

        const baseMenu = [...(this.designerMenus[this.currentContext()] || [])];

        // Dynamically add tablet sections if in Tablet context
        if (this.currentContext() === 'Tablet') {
            const sections: MenuItem[] = this.tabletState.sections().map(s => ({
                label: s.label,
                icon: 'view_quilt',
                route: `/tablet/design`,
                queryParams: { id: s.id },
                action: () => this.tabletState.selectSection(s.id)
            }));
            return [...baseMenu, ...sections];
        }

        return baseMenu;
    });

    constructor() {
        window.addEventListener('resize', () => {
            this._isMobileView.set(window.innerWidth < 768);
        });
    }

    // Actions
    toggleSidebar() {
        this._isSidebarOpen.update(v => !v);
    }

    collapseSidebar(collapsed: boolean) {
        this._isSidebarCollapsed.set(collapsed);
    }

    setContext(context: AppContext) {
        this._currentContext.set(context);
    }

    // New helper for login flow
    resetToDesignerDefaults() {
        this._currentContext.set('Protocol');
        // Ensure sidebar is open
        this._isSidebarOpen.set(true);
    }
}
