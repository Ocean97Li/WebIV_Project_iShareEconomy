import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { UserAuthModule } from './user-auth/user-auth.module';
import { MainModule } from './main/main.module';
import { HttpClientModule, HttpHandler } from '@angular/common/http';

const appRoutes: Routes = [
    { path: '**', redirectTo: 'login'}
];
@NgModule({
    imports: [
        UserAuthModule,
        MainModule,
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules
        }),
    ],
    exports: [RouterModule, UserAuthModule],
    providers: []

})
export class AppRoutingModule { }
