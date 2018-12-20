import { Injectable } from "@angular/core";
import { ShoppingCartService } from "app/restaurant-detail/shopping-cart/shopping-cart.service";
import { CartItem } from "app/restaurant-detail/shopping-cart/cart-item.model";
import { Order } from "./order.model";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { MEAT_API } from '../app.api';
import { LoginService } from '../security/login/login.service';

@Injectable()
export class OrderService {

    constructor(private cartService: ShoppingCartService, 
                private http: HttpClient, 
                private loginService: LoginService){}

    cartItems(): CartItem[]{
        return this.cartService.items;
    }

    increaseQuantity(item: CartItem) {
        this.cartService.increaseQuantity(item);
    }

    decreaseQuantity(item: CartItem) {
        this.cartService.decreaseQuantity(item);
    }

    remove(item: CartItem) {
        this.cartService.removeItem(item);
    }

    itemsValue(): number {
        return this.cartService.total();
    }

    checkOrder(order: Order): Observable<string> {
        let headers = new HttpHeaders()
        if (this.loginService.isUserLoggedIn) {
            headers = headers.set('Authorization', `Bearer ${this.loginService.user.accessToken}`)
            console.log(this.loginService.user.accessToken)
        }
        return this.http.post<Order>(`${MEAT_API}/api/order`, order, {headers: headers})
                                    .map(order => order._id);
    }

    clear() {
        this.cartService.clear();
    }


}