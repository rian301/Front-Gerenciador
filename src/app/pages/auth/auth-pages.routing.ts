import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '../../layouts/auth/auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { title: 'Login' }
            },
            {
				path: 'esqueci-senha',
				component: ForgotPasswordComponent,
				data: { title: 'Esqueci minha senha' }
			},
            {
				path: 'cadastrar-senha',
				component: ResetPasswordComponent,
				data: { title: 'Cadastrar minha senha' }
			}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AuthRoutingModule {

}