
import { Routes } from '@angular/router';
import { UserListComponent } from './ui/user-list.component';

export const IDENTITY_ROUTES: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'users', component: UserListComponent }
        ]
    }
];
