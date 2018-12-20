import { HttpErrorResponse } from "@angular/common/http";
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";

export class ErrorHandler {

    static handleError(error: HttpErrorResponse | any){
        let errorMessage: string;

        if (error instanceof HttpErrorResponse) {
            const body = error.error;
            errorMessage = `Erro ${error.status} ao obter a url ${error.url} - ${body}`;
        } else {
            errorMessage = errorMessage? errorMessage: error.toString();
        }

        console.log(errorMessage);
        return Observable.throw(errorMessage);
    }
}