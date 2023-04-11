import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./pages/admin/admin-pages.module').then(m => m.AdminPagesModule)
    },
    {
        path: '',
        loadChildren: () => import('./pages/auth/auth-pages.module').then(m => m.AuthPagesModule)
    },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {

}
