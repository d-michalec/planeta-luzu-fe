import { Routes } from '@angular/router';
import { Landing } from './main/landing/landing';
import { Registration } from './main/registration/registration';
import { Admin } from './admin/admin';
import { Headphones } from './admin/headphones/headphones.component';
import { Attendees } from './admin/attendees/attendees';
import { RegisteredUsers } from './admin/registered-users/registered-users';
import { AssignHeadphones } from './admin/assign-headphones/assign-headphones';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'registration', component: Registration },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'attendees', component: Attendees },
      { path: 'headphones', component: Headphones },
      { path: 'registration', component: RegisteredUsers },
      { path: 'assign-headphones', component: AssignHeadphones
      }
    ],
  },
];
