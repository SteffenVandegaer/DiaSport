import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
 import { Geolocation } from '@ionic-native/geolocation';

 declare var google;
 var myLat=0;
 var myLng=0;
 var directions;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  
  
  constructor(public navCtrl: NavController,private googleMaps: GoogleMaps,private geolocation: Geolocation,public alertCtrl: AlertController) {

  }


  ionViewDidLoad() {
    this.loadMap();
   }
  

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      myLat=resp.coords.latitude
      myLng=resp.coords.longitude
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          },
          zoom: 18,
          tilt: 10
        }
      };
  
      this.map = this.googleMaps.create('map', mapOptions);
  
      // Wait the MAP_READY before using any methods.
      this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          
          
          console.log('Map is ready!');
  
          // Now you can use all methods safely.
          this.map.addMarker({
              title: 'My Location',
              icon: 'green',
              animation: 'DROP',
              position: {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
              }
            })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  this.showConfirm();
                });
            });
  
        });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     
   }

   showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Share your location?',
      message: 'Do you want to share your location with someone?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    
    confirm.present();
  }


}
