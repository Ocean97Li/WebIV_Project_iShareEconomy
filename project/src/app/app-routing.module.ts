import { NgModule } from '@angular/core';
import {RouterModule, Routes, Router} from '@angular/router';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent
  }
];
@NgModule({
   exports: [ RouterModule ],
   imports:  [ RouterModule.forRoot(routes)]

})
export class AppRoutingModule { }
