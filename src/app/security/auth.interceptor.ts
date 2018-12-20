import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import { LoginService } from "./login/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginService = this.injector.get(LoginService);
        if (loginService.isUserLoggedIn()) {
            const authRequest = request.clone( // We need to use the 'clone' method because the original request is immutable
                {setHeaders: {'Authorization': `Bearer ${loginService.user.accessToken}`}});
            return next.handle(authRequest)
        } else {
            return next.handle(request);            
        }
    }
}