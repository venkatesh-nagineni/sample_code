import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
//import {Observable} from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
 import { TickerList } from '../dataservice/homelist';
/*import { GbhOilList } from '../dataservice/homelist';
import { TodayChartList } from '../dataservice/homelist';
import { YesterdayChartList } from '../dataservice/homelist'; */
//import { LoadingController } from 'ionic-angular';


@Injectable()
export class Authservice {
  public token: string;
  constructor(public http: Http, public storage: Storage) {
  }

  login(username, Kennwort) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://www.futures-services.com:3084/api/authenticate/', JSON.stringify({ username: username, Kennwort: Kennwort }), { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }


  async resetpwd(email, username): Promise<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var options = new RequestOptions({ headers: headers });
    let response = await this.http.post('http://www.futures-services.com:3084/api/pwdreset/', JSON.stringify({ email: email, username: username }), options).toPromise();
    return response.json();
  }

  async accesscheck(): Promise<any[]> {
    const token = await this.storage.get('token');
    const sessionID = await this.storage.get('sessionID');
    const username = await this.storage.get('username');
    let headers = new Headers();
    headers.append('x-access-token', token);
    headers.append('session', sessionID);
    headers.append('username', username);
    headers.append('Content-Type', 'application/json');
    var options = new RequestOptions({ headers: headers });
    let response = await this.http.post('http://www.futures-services.com:3084/middle/logaccess/', JSON.stringify({ username: username }), options).toPromise();
    return response.json();
  }

 



  logout() {
    this.storage.remove('token'); // after log out token must be removed
    this.storage.remove("sessionID"); // after log out session details must be removed
  }

}
