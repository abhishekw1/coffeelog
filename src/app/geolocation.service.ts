import { Injectable } from '@angular/core';
import { PlaceLocation } from './logic/PlaceLocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  requestLocation(callback: Function) {
    //W3C Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback(position.coords);
      },
      (error) => {
        // log the error in the systeam
        callback(null);
      }
    );
  }

  getMapLink(location: PlaceLocation) {
    let query = '';
    if (location.latitude && location.longitude) {
      query = `${location.latitude},${location.longitude}`;
    } else {
      query = `${location.address},${location.city}`;
    }
    if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
      return `https://maps.apple.com/?q=${query}`;
    }else{
      return `https://maps.google.com/?q=${query}`;
    }
  }

  constructor() {}
}
