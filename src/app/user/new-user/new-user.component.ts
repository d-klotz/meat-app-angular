import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { NewUserService } from './new-user.service';
import { LoginService } from "../../security/login/login.service";
import { User } from "../user.model";
import { NotificationService } from 'app/shared/messages/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mt-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent implements OnInit {

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  numberPattern = /^[0-9]*$/;

  newUserForm: FormGroup;

  constructor(private newUserService: NewUserService, 
        private notificationService: NotificationService, 
        private loginService: LoginService,
        private router: Router) { }

  ngOnInit() {
    this.newUserForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }), // com angular 6 é possivel declarar itens do formulario desta forma
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(this.emailPattern)]
      }),
      emailConfirmation: new FormControl('', { 
        validators: [Validators.required, Validators.pattern(this.emailPattern)]
      }),
      defaultAddress: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      number: new FormControl('', {validators: 
        [Validators.required, Validators.pattern(this.numberPattern)]
      }),
      optionalAddress: new FormControl(''),
      password: new FormControl('', {validators: 
        [Validators.required, Validators.minLength(5)]
      }),
      confirmationPassword: new FormControl('', {validators: 
        [Validators.required, Validators.minLength(5)]
      }),
    }, { validators: [NewUserComponent.equalsTo], updateOn: 'blur' })
  }

  static equalsTo(group: AbstractControl): {[key:string]: boolean} {
    const email = group.get('email');
    const emailConfirmation = group.get('emailConfirmation');
    const password = group.get('password');
    const confirmationPassword = group.get('confirmationPassword');

    if (!email || !emailConfirmation) {
      return undefined;
    }

    if (email.value !== emailConfirmation.value) {
      return {emailsNotMatch:true};
    }

    if (!password || !confirmationPassword) {
      return undefined;
    }

    if (password.value !== confirmationPassword.value) {
      return {passwordsNotMatch:true};
    }

    return undefined;
  }

  createUser() {
    let user: User = {
      name : this.newUserForm.controls['name'].value,
      email : this.newUserForm.controls['email'].value,
      password : this.newUserForm.controls['password'].value,
      address : this.newUserForm.controls['defaultAddress'].value,
      number : this.newUserForm.controls['number'].value,
      complement : this.newUserForm.controls['optionalAddress'].value
    };
    this.newUserService.createUser(user)
            .subscribe(user => {
              this.loginService.login(user.email, user.password)
                .subscribe(user => {
                  this.notificationService.notify(`Bem vindo ${user.name}`);
                  this.router.navigate(['/restaurants']);
                });
            })
  }

}
