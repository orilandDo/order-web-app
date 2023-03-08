import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "../common/config";

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': 'true'
    })
};

@Injectable({
    providedIn: 'root'
})

export class WebRequestService {
    readonly baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = CONFIG.BASE_URL;
    }

    get(url: string) {
        return this.http.get(`${this.baseUrl}/${url}`, httpOptions);
    }

    post(url: string, payload?: Object) {
        return this.http.post(`${this.baseUrl}/${url}`, payload, httpOptions);
    }

    put(url: string, payload?: Object) {
        return this.http.put(`${this.baseUrl}/${url}`, payload, httpOptions);
    }

    delete(url: string) {
        return this.http.delete(`${this.baseUrl}/${url}`, httpOptions);
    }

    login(username: string, password: string) {
        return this.http.post(`${this.baseUrl}/${CONFIG.URL.LOGIN}`, {
            username,
            password
        }, {
            observe: 'response'
        });
    }
}