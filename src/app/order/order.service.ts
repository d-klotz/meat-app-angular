import { Injectable } from "@angular/core";
import { ShoppingCartService } from "app/restaurant-detail/shopping-cart/shopping-cart.service";
import { CartItem } from "app/restaurant-detail/shopping-cart/cart-item.model";
import { Order } from "./order.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient} from "@angular/common/http";
import { MEAT_API } from '../app.api';

@Injectable()
export class OrderService {

    constructor(private cartService: ShoppingCartService, 
                private http: HttpClient){}

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
        return this.http.post<Order>(`${MEAT_API}/api/order`, order)
                                    .pipe(map(order => order._id));
    }

    clear() {
        this.cartService.clear();
    }


}