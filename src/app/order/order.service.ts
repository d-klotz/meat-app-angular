import { Injectable } from "@angular/core";
import { ShoppingCartService } from "app/restaurant-detail/shopping-cart/shopping-cart.service";
import { CartItem } from "app/restaurant-detail/shopping-cart/cart-item.model";
import { Order } from "./order.model";
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions } from "@angular/http";
import { MEAT_API } from '../app.api';

@Injectable()
export class OrderService {

    constructor(private cartService: ShoppingCartService, private http: Http){}

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
        const headers = new Headers();
        headers.append('Content-Type', 'application/json')
        return this.http.post(`${MEAT_API}/order`, 
                                JSON.stringify(order),
                                 new RequestOptions({headers: headers}))
                        .map(response => response.json());
    }

    clear() {
        this.cartService.clear();
    }


}