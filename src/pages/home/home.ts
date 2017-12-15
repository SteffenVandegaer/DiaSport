import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
 } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { ContactsPage } from '../contacts/contacts';
import { NavigatePage } from '../navigate/navigate';
import { empty } from 'rxjs/Observer';


 var myLat=0;
 var myLng=0;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;
  
  
  constructor(public navCtrl: NavController,private googleMaps: GoogleMaps,private geolocation: Geolocation,public alertCtrl: AlertController, private afAuth: AngularFireAuth) {
    
    
  }

  ionViewDidLoad(){
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
     
    setTimeout(()=> {
      this.startTimer(this.map);
    }, 3000);
   }
   startTimer=(myMap)=>{
      this.geolocation.getCurrentPosition().then((resp) => {
        myLat=resp.coords.latitude
        myLng=resp.coords.longitude
        this.afAuth.authState.subscribe( user => {
          if (user) {
            const users: firebase.database.Reference = firebase.database().ref(`/Location/`+user.uid);
            users.on('value', snapshot=> {
              var updates = {};
              updates['/Location/' + user.uid] = {lat:myLat,lng:myLng};
              firebase.database().ref().update(updates);
            });
          }
          
        });
        myMap.clear();
        this.afAuth.authState.subscribe( user => {
          const Connections: firebase.database.Reference = firebase.database().ref(`/Connection/`+user.uid);
          Connections.on('value', connections=> {
            connections.forEach((connection)=>{
              const Coords: firebase.database.Reference = firebase.database().ref(`/Location/`+connection.val().uid);
              Coords.on('value', coord=> {
                const username:firebase.database.Reference = firebase.database().ref(`/User/`+connection.val().uid);
                username.on('value',name=>{
                  var d = new Date();
                  if(d.getTime()-connection.val().time>3600000){
                    const recordToRemove: firebase.database.Reference=firebase.database().ref('/Connection/'+user.uid+'/'+connection.key);
                    recordToRemove.remove();
                  }else{
                    myMap.addMarker({
                      title: name.val().user_name+'\'s location',
                      icon: 'blue',
                      animation: 'NONE',
                      position: {
                        lat: coord.val().lat,
                        lng: coord.val().lng
                      }
                    })
                    .then(marker => {
                      marker.on(GoogleMapsEvent.MARKER_CLICK)
                        .subscribe(() => {
                          this.navCtrl.push(NavigatePage,{param1:name.val().user_name});
                        });
                    });
                  }
                  
                });
              });
              return false;
            });
          });
        });

        myMap.addMarker({
          title: 'My Location',
          icon: 'green',
          animation: 'NONE',
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
        setTimeout(()=> {
          this.startTimer(myMap);
        }, 3000);
  
       }).catch((error) => {
         console.log('Error getting location', error);
       });

       
    }
   showConfirm() {
    let teller=0;
    var aantal=0;
    let testBool=true;
    this.afAuth.authState.subscribe( user => {
      if (user) {
        const contacts: firebase.database.Reference = firebase.database().ref(`/Contacts/`+user.uid);
        contacts.on('value', snapshot=> {
          let alert = this.alertCtrl.create();
          alert.setTitle('Select a contact to share your location with');
          //alert.addInput({type: 'radio', label: '', value: '0'});
          snapshot.forEach((element)=>{
            aantal++;
            return false;
          });
          snapshot.forEach((element)=>{
            
            const Names: firebase.database.Reference = firebase.database().ref(`/User/`+element.val().uid);
            Names.on('value', namen=> {
              if(namen.val()!=empty){
                teller++;
                console.log(aantal);
                alert.addInput({type: 'radio', label: namen.val().user_name, value: namen.key});
              }
              if(teller==aantal){
                alert.addButton('Cancel');
                alert.addButton({
                  text: 'OK',
                  handler: data => {
                    if(data!='0'){
                      const getId: firebase.database.Reference = firebase.database().ref(`/Connection/`+data);
                      getId.on('value', idsInDb=> {
                        let id=1;
                        if(idsInDb.val()!=null){
                          idsInDb.forEach((recordUitDb)=>{
                            id=parseInt(recordUitDb.key)+1;  
                            return false;
                          })
                        }
                        if(testBool){
                          testBool=false;
                          let uid=user.uid;
                          var updates = {};
                          var d = new Date();
                          updates['/Connection/' + data+'/'+id] = {uid,time:d.getTime()};
                          firebase.database().ref().update(updates);
                        }
                        
      
                      });
                    }
                  }
                  
                });
                alert.present();
              }
            });
            return false;
          });
          
        });
        
      }
      
    });

    
    
  }
  contact(){
    this.navCtrl.push(ContactsPage);
  }

}