import { Injectable } from '@angular/core';
import { Coffee } from './logic/Coffee';
import { PlaceLocation } from './logic/PlaceLocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public endpoint = 'http://localhost:3000';
  public coffeeEntity = '/coffees';

  constructor(private httpClient: HttpClient) {}

  getList(callback: Function) {
    const list = [
      new Coffee(
        "1",
        'Mba ChaiWala',
        'Wakad',
        new PlaceLocation('Bhumkar Chowk', 'Wakad')
      ),
      new Coffee(
        "2",
        'Chai Sutta Bar',
        'Wakad',
        new PlaceLocation('Bhumkar Chowk', 'Wakad')
      ),
    ];
    callback(list);
    // this.httpClient
    //   .get(`${this.endpoint}${this.coffeeEntity}`)
    //   .subscribe((reponse) => callback(reponse));
  }


  getCoffee(id: string, callback: Function) {
    this.httpClient
      .get(`${this.endpoint}${this.coffeeEntity}/${id}`)
      .subscribe((response) => callback(response));
  }


  save(coffee: any, callback: Function) {
    if (coffee._id) {
      this.httpClient
        .put(`${this.endpoint}${this.coffeeEntity}/${coffee._id}`, coffee)
        .subscribe((response) => callback(true));
    } else {
      this.httpClient
        .post(`${this.endpoint}${this.coffeeEntity}`, coffee)
        .subscribe((response) => callback(true));
    }
  }

}
