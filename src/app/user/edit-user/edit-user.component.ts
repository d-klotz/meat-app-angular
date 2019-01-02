import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { LoginService } from 'app/security/login/login.service';
import { EditUserService } from './edit-user.service';
import { User } from '../user.model';
import { NotificationService } from 'app/shared/messages/notification.service';

@Component({
  selector: 'mt-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {

  editUserForm: FormGroup;

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  numberPattern = /^[0-9]*$/;

  constructor(private loginService: LoginService, 
              private editUserService: EditUserService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.editUserForm = new FormGroup({
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
    }, { validators: [EditUserComponent.equalsTo], updateOn: 'blur' })

    this.autoFillFields()
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

  autoFillFields(){
    if (this.loginService.isUserLoggedIn) {
      this.editUserForm.controls['name'].setValue(this.loginService.user.name);
      this.editUserForm.controls['email'].setValue(this.loginService.user.email);
      this.editUserForm.controls['emailConfirmation'].setValue(this.loginService.user.email);
      this.editUserForm.controls['defaultAddress'].setValue(this.loginService.user.address);
      this.editUserForm.controls['number'].setValue(this.loginService.user.number);
      this.editUserForm.controls['optionalAddress'].setValue(this.loginService.user.complement);
      this.editUserForm.controls['password'].setValue(this.loginService.user.password);      
      this.editUserForm.controls['confirmationPassword'].setValue(this.loginService.user.password);
    }
  }

  user() {
    return this.loginService.user;
  }

  saveUser() {
    let user: User = {
      id: this.user().id,
      name : this.editUserForm.controls['name'].value,
      email : this.editUserForm.controls['email'].value,
      password : this.editUserForm.controls['password'].value,
      address : this.editUserForm.controls['defaultAddress'].value,
      number : this.editUserForm.controls['number'].value,
      complement : this.editUserForm.controls['optionalAddress'].value
    };
    this.editUserService.updateUser(user)
              .subscribe(user => {
                  console.log(user);
                  this.notificationService.notify("Cadastro atualizado com Sucesso!");
              });
  }

}
