import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { UserModule } from './user/user.module';
import { MainModule } from './main/main.module';
import { HttpClientModule, HttpHandler } from '@angular/common/http';

const appRoutes: Routes = [
    { path: '**', redirectTo: 'login'}
];
@NgModule({
    imports: [
        UserModule,
        MainModule,
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules
        }),
    ],
    exports: [RouterModule, UserModule],
    providers: []

})
export class AppRoutingModule { }
