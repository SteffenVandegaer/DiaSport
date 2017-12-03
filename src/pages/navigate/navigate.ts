import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

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
  connection
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider, private afAuth: AngularFireAuth) {
    this.connection = navParams.get('param1');
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
       this.navigatie();
   }

   navigatie(){
    this.afAuth.authState.subscribe( user => {
      if (user) {
        const Connections: firebase.database.Reference = firebase.database().ref(`/User`);
        Connections.on('value', snapshot=> {
          snapshot.forEach((element)=>{
            if(element.val().user_name==this.connection){
              const Names: firebase.database.Reference = firebase.database().ref(`/Location/`+element.key);
              Names.on('value', snapshott=> {
                this.calculateAndDisplayRoute(snapshott.val().lat,snapshott.val().lng);
              });
              return true;
            }
            return false;
          });
        });
      }
    });
     
   }

   calculateAndDisplayRoute(destLat, destLng) {
    this.directionsService.route({
      origin: new google.maps.LatLng(myLat, myLng),
      destination: new google.maps.LatLng(destLat, destLng),
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        this.navigatie();
      }
    });
  }
}