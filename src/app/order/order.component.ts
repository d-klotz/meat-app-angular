import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

import { RadioOption } from 'app/shared/radio/radio-option.model';
import { OrderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import { Order, OrderItem } from './order.model';
import { LoginService } from 'app/security/login/login.service';
import { unescapeIdentifier } from '@angular/compiler';

import 'rxjs/add/operator/do';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  numberPattern = /^[0-9]*$/;

  orderForm: FormGroup;

  delivery: number = 8;

  orderId: string;

  paymentOptions: RadioOption[] = [
    {label: 'Dinheiro', value: 'MON'},
    {label: 'Cartão de Débito', value: 'DEB'},
    {label: 'Cartão Refeicão', value: 'REF'},
  ]

  constructor(private orderService: OrderService, 
              private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService) { }

              
  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      emailConfirmation: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      number: this.formBuilder.control('', [Validators.required, Validators.pattern(this.numberPattern)]),
      optionalAddress: this.formBuilder.control(''),
      paymentOption: this.formBuilder.control('', [Validators.required])
    }, { validator: OrderComponent.equalsTo })
  
    this.autoFillFields();
  }

  autoFillFields(){
    if (this.loginService.isUserLoggedIn) {
      this.orderForm.controls['name'].setValue(this.loginService.user.name);
      this.orderForm.controls['email'].setValue(this.loginService.user.email);
      this.orderForm.controls['emailConfirmation'].setValue(this.loginService.user.email);
    }
  }

  static equalsTo(group: AbstractControl): {[key:string]: boolean} {
    const email = group.get('email');
    const emailConfirmation = group.get('emailConfirmation');

    if (!email || !emailConfirmation) {
      return undefined;
    }

    if (email.value !== emailConfirmation.value) {
      return {emailsNotMatch:true};
    }

    return undefined;
  }

  itemsValue(): number {
    return this.orderService.itemsValue();
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems();
  }

  increaseQuantity(item: CartItem) {
    this.orderService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem) {
    this.orderService.decreaseQuantity(item);
  }

  remove(item: CartItem) {
    this.orderService.remove(item);
  }

  checkOrder(order: Order) {
    
    order.orderItems = this.cartItems()    
      .map((item: CartItem) => new OrderItem(item.quantity, item.menuItem._id));
      this.orderService.checkOrder(order)
        .do((orderId: string) => {
          this.orderId = orderId;
        })
        .subscribe((orderId: string) => {
          this.router.navigate(['/order-sumary']);
          this.orderService.clear();
      })
  }

  isOrderCompleted(): boolean {
    return this.orderId !== undefined;
  }

}
