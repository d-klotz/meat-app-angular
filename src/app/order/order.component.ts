import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { RadioOption } from 'app/shared/radio/radio-option.model';
import { OrderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import { Order, OrderItem } from './order.model';
import { LoginService } from 'app/security/login/login.service';

import { tap } from 'rxjs/operators';

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
              private loginService: LoginService) { }

              
  ngOnInit() {
    this.orderForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }), // com angular 6 é possivel declarar itens do formulario desta forma
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(this.emailPattern)]
      }),
      emailConfirmation: new FormControl('', { 
        validators: [Validators.required, Validators.pattern(this.emailPattern)]
      }),
      address: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      number: new FormControl('', {validators: 
        [Validators.required, Validators.pattern(this.numberPattern)]
      }),
      optionalAddress: new FormControl(''),
      paymentOption: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    }, { validators: [OrderComponent.equalsTo], updateOn: 'blur' }) // e tbm adicionar validators a todo o form
  
    this.autoFillFields();
  }

  autoFillFields(){
    if (this.loginService.isUserLoggedIn) {
      this.orderForm.controls['name'].setValue(this.loginService.user.name);
      this.orderForm.controls['email'].setValue(this.loginService.user.email);
      this.orderForm.controls['emailConfirmation'].setValue(this.loginService.user.email);
      this.orderForm.controls['address'].setValue(this.loginService.user.address);
      this.orderForm.controls['number'].setValue(this.loginService.user.number);
      this.orderForm.controls['optionalAddress'].setValue(this.loginService.user.complement);
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
    order.user = this.loginService.user.id;
    order.total = this.orderService.itemsValue();
    order.orderItems = this.cartItems()  
      .map((item: CartItem) => new OrderItem(item.quantity, item.menuItem._id));
      this.orderService.checkOrder(order)
      .pipe(
        tap((orderId: string) => {
          this.orderId = orderId;
        })
      )
        .subscribe((orderId: string) => {
          this.router.navigate(['/order-sumary']);
          this.orderService.clear();
      })
  }

  isOrderCompleted(): boolean {
    return this.orderId !== undefined;
  }

}
