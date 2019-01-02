import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/order/order.service';
import { OrderItem } from 'app/order/order.model';
import { LoginService } from 'app/security/login/login.service';

@Component({
  selector: 'mt-user-order',
  templateUrl: './user-order.component.html'
})
export class UserOrderComponent implements OnInit {

  userOrders: OrderItem[] = [];
  orderItems: any[] = [{}];

  constructor(private orderService: OrderService,
              private loginService: LoginService) { }

  ngOnInit() {
    this.orderService.ordersByUser(this.loginService.user.id)
                  .subscribe(orders => {
                    this.userOrders = orders
                  });
  }

}
