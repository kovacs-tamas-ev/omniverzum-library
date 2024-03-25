import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { BookListComponent } from './book/components/book-list/book-list.component';
import { ProfileComponent } from './user/components/profile/profile.component';
import { BookWithEventListComponent } from './book/components/book-with-event-list/book-with-event-list.component';
import { UploadComponent } from './book/components/upload/upload.component';
import { adminGuard } from './auth/guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'available-books',
        component: BookWithEventListComponent
    },

    {
        path: 'admin',
        canActivateChild: [adminGuard],
        children: [
            {
                path: 'user-list',
                component: UserListComponent
            },
            {
                path: 'book-list',
                component: BookListComponent
            },
            {
                path: 'book-import',
                component: UploadComponent
            }        
        ]
    }

];
