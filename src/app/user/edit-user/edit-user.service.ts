import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../user.model";
import { Observable } from "rxjs";
import { MEAT_API } from "app/app.api";
import { tap } from "rxjs/operators";
import { LoginService } from "app/security/login/login.service";

@Injectable()
export class EditUserService {

    constructor(private http: HttpClient, private loginService: LoginService) {}

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${MEAT_API}/user/${user.id}`, user)
            .pipe(tap(user => this.loginService.updateLoginUser(user)));
    }

}