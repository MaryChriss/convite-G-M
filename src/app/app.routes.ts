import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { History } from './pages/history/history';
import { Confirmation } from './pages/confirmation/confirmation';
import { Photos } from './pages/photos/photos';
import { Tips } from './pages/tips/tips';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'history', component: History },
  { path: 'confirmation', component: Confirmation },
  { path: 'photos', component: Photos },
  { path: 'tips', component: Tips },
];
