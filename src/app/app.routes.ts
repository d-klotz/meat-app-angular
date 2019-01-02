import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RestaurantsComponent } from "./restaurants/restaurants.component";
import { RestaurantDetailComponent } from "./restaurant-detail/restaurant-detail.component";
import { MenuComponent } from "./restaurant-detail/menu/menu.component";
import { ReviewsComponent } from "./restaurant-detail/reviews/reviews.component";
import { OrderSumaryComponent } from "./order-sumary/order-sumary.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { LoginComponent } from "./security/login/login.component";
import { LoggedInGuard } from "./security/loggedin.guard";
import { NewUserComponent } from "./user/new-user/new-user.component";
import { EditUserComponent } from "./user/edit-user/edit-user.component";
import { UserOrderComponent } from "./user/user-order/user-order.component";

export const ROUTES: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login/:to', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'user-orders', component: UserOrderComponent},
    {path: 'new-user', component: NewUserComponent},
    {path: 'edit-user', component: EditUserComponent, 
        canLoad: [LoggedInGuard], canActivate: [LoggedInGuard]},
    {path: 'about', loadChildren: './about/about.module#AboutModule'},
    {path: 'restaurants/:id', component: RestaurantDetailComponent,
    children: [
        {path: '', redirectTo:'menu', pathMatch: 'full'},
        {path: 'menu', component: MenuComponent},
        {path: 'reviews', component: ReviewsComponent},
    ]},
    {path: 'restaurants', component: RestaurantsComponent},
    {path: 'order', loadChildren: './order/order.module#OrderModule',
        canLoad: [LoggedInGuard], canActivate: [LoggedInGuard]},    
    {path: 'order-sumary', component: OrderSumaryComponent},    
    {path: '**', component: NotFoundComponent}
]