import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'random-user',
    loadComponent: () => import('./random-user/random-user.page').then( m => m.RandomUserPage)
  },
  {
    path: 'grammar-checker',
    loadComponent: () => import('./grammar-checker/grammar-checker.page').then( m => m.GrammarCheckerPage)
  },
];
