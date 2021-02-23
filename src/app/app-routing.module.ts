import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);
const redirectLoggedInToHome = () => redirectLoggedInTo(["home"]);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'list-details/:id',
    loadChildren: () => import('./pages/list-details/list-details.module').then(m => m.ListDetailsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'todo-details/:id',
    loadChildren: () => import('./pages/todo-details/todo-details.module').then(m => m.TodoDetailsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./pages/password-recovery/password-recovery.module').then(m => m.PasswordRecoveryPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToHome}
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },  {
    path: 'flag',
    loadChildren: () => import('./etc/flag/flag.module').then( m => m.FlagPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
