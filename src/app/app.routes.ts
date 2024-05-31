import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {MainLayoutComponent} from "./layout/app-layout/main-layout/main-layout.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  {path:'cc',component:AppComponent},
  {
    path:'',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/bet', pathMatch: 'full' },
      { path: 'bet', children:[
          {path:'', component:DashboardComponent},
          {path:'home', component:DashboardComponent}
        ]
      },
    ]
  },
  {path:'*',redirectTo:'cc'}
];
