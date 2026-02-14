
import { Injectable, signal, computed } from '@angular/core';

export interface User {
    id: string;
    name: string;
    email: string;
    isAuthenticated: boolean;
    avatarUrl?: string;
    roles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Signal managing the current user state
    private currentUserSignal = signal<User>({
        id: '',
        name: '',
        email: '',
        isAuthenticated: false,
        avatarUrl: '',
        roles: []
    });

    readonly currentUser = this.currentUserSignal.asReadonly();

    readonly isAuthenticated = computed(() => this.currentUser().isAuthenticated);
    readonly roles = computed(() => this.currentUser().roles);
    readonly isDesigner = computed(() => this.hasRole('Designer'));

    constructor() {
        // Check local storage
        const cachedUser = localStorage.getItem('access_token');
        if (cachedUser) {
            this.setMockUser(['Designer']); // Auto-login as designer for persistence in this demo
        }
    }

    login(credentials: { user: string, pass: string }) {
        if (credentials.user === 'designer' && credentials.pass === 'designer') {
            this.setMockUser(['Designer']);
            localStorage.setItem('access_token', 'mock-designer-token');
            return true;
        }

        if (credentials.user === 'admin' && credentials.pass === 'admin') {
            this.setMockUser(['admin']);
            localStorage.setItem('access_token', 'mock-admin-token');
            return true;
        }
        return false;
    }

    // Helper to switch roles dynamically for demo purposes
    toggleRole() {
        const current = this.isDesigner();
        this.setMockUser(current ? ['User'] : ['Designer']);
    }

    private setMockUser(roles: string[]) {
        this.currentUserSignal.set({
            id: 'mock-uuid',
            name: roles.includes('Designer') ? 'Designer User' : 'Standard User',
            email: 'user@ventra.io',
            isAuthenticated: true,
            avatarUrl: 'https://i.pravatar.cc/150',
            roles: roles
        });
    }

    logout() {
        this.currentUserSignal.set({
            id: '',
            name: '',
            email: '',
            isAuthenticated: false,
            roles: []
        });
        localStorage.removeItem('access_token');
    }

    hasRole(role: string): boolean {
        return this.roles().includes(role);
    }
}
