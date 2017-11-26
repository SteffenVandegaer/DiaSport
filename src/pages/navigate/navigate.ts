import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NavigatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
var myLat, myLng;
@IonicPage()
@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})

export class NavigatePage {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad(){
    this.initializeMap();
  }

  initializeMap() {
    
       let locationOptions = {timeout: 20000, enableHighAccuracy: true};
       
       navigator.geolocation.getCurrentPosition(
    
           (position) => {
               myLat=position.coords.latitude;
               myLng=position.coords.longitude;
               let options = {
                 center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                 zoom: 16,
                 mapTypeId: google.maps.MapTypeId.ROADMAP
               }
    
               this.map = new google.maps.Map(document.getElementById("map_canvas"), options);
               this.directionsDisplay.setMap(this.map);
           },
    
           (error) => {
               console.log(error);
           }, locationOptions
       );
       
   }

   navigatie(){
     this.calculateAndDisplayRoute();
   }

   calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: new google.maps.LatLng(myLat, myLng),
      destination: new google.maps.LatLng(50.839761, 5.022186),
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
