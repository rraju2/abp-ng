
import { Injectable, signal, computed } from '@angular/core';

export interface UserDto {
    id: string;
    userName: string;
    email: string;
    name: string;
    phoneNumber?: string;
    isActive: boolean;
    creationTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserProxyService {

    // This service mimics what @abp/ng.core generates for Proxies

    private _users = signal<UserDto[]>([]);
    readonly users = this._users.asReadonly();

    // Simulated REST request with delay
    async getList(input: { maxResultCount: number, skipCount: number }): Promise<void> {
        console.log('UserProxyService.getList fetching...');

        // Simulate HTTP delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockData: UserDto[] = Array.from({ length: 10 }).map((_, i) => ({
            id: crypto.randomUUID(),
            userName: `user_${i + 1}`,
            email: `user${i}@ventra.io`,
            name: `Demo User ${i}`,
            isActive: i % 3 !== 0,
            creationTime: new Date().toISOString()
        }));

        this._users.set(mockData);
    }

    // Computed signals can filter data directly without multiple fetch calls
    readonly activeUsers = computed(() => this.users().filter(u => u.isActive));
}
