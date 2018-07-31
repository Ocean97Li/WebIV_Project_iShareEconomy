import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainComponent } from './main/components/main/main.component';

const appRoutes: Routes = [
    { path: '**', component: MainComponent}
];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule],

})
export class AppRoutingModule { }
