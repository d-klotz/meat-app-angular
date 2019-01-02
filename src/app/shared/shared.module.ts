import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { InputComponent } from "./input/input.component";
import { RadioComponent } from "./radio/radio.component";
import { RatingComponent } from "./rating/rating.component";

import { ShoppingCartService } from "app/restaurant-detail/shopping-cart/shopping-cart.service";
import { RestaurantsService } from "app/restaurants/restaurants.service";
import { OrderService } from "app/order/order.service";
import { SnackbarComponent } from './messages/snackbar/snackbar.component';
import { NotificationService } from "./messages/notification.service";
import { LoginService } from "app/security/login/login.service";
import { NewUserService } from "../user/new-user/new-user.service";
import { EditUserService } from "../user/edit-user/edit-user.service";
import { LoggedInGuard } from "../security/loggedin.guard";
import { LeaveOrderGuard } from "../order/leave-order.guard";
import { AuthInterceptor } from "app/security/auth.interceptor";

@NgModule({
    declarations: [InputComponent, RadioComponent, RatingComponent, SnackbarComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [InputComponent, RadioComponent, 
                RatingComponent, CommonModule, 
                FormsModule, ReactiveFormsModule,
                SnackbarComponent]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [ShoppingCartService, 
                        RestaurantsService, 
                        OrderService, 
                        NotificationService, 
                        LoginService,
                        EditUserService,
                        NewUserService,
                        LoggedInGuard,
                        LeaveOrderGuard,
                        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}]
        }
    }

}