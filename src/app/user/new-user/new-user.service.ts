import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../user.model";
import { Observable} from "rxjs";
import { MEAT_API } from "app/app.api";

@Injectable()
export class NewUserService {

    constructor(private http: HttpClient) {}

    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${MEAT_API}/createUser`, user);
                
    }
}