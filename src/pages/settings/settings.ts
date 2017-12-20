import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public app : MyApp;
  public testtest: String="";
  public data:any[] = [];
  
  private User;

  constructor( public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public authData: AuthProvider, private afAuth: AngularFireAuth) {
    
  }

  ionViewDidLoad() {
    //zet username van de gebruiker in het tekstvak
    this.afAuth.authState.subscribe( user => {
      if (user) {
        this.User=user;
        const users: firebase.database.Reference = firebase.database().ref(`/User/`+user.uid);
        users.on('value', snapshot=> {
          this.testtest=String(snapshot.val().user_name);
          
        });
      }
      
    });
    
  }
 
  logout(){
    //logout user en navigeer naar de loginpagina
    this.authData.logoutUser();
    this.navCtrl.push(LoginPage);
    window.location.reload();
  }
  
  saveSettings(){
    //sla nieuwe username op in de db
    let check=true;
    let available=true;
    if(this.testtest!=""){
        if (this.User) {
          const users: firebase.database.Reference = firebase.database().ref(`/User`);
          users.on('value', snapshot=> {
            snapshot.forEach( element => {
              if(element.val().user_name==this.testtest && element.key != this.User.uid){
                available=false;
                return true;
              }
              return false;
            });
            if(check){
              check=false;
              this.checkName(available);
            }
            
          });
      }
    }
  }

  checkName(available){
    //kijk na of de nieuwe username beshikbaar is
    let check=true;
      if(available){
        const users: firebase.database.Reference = firebase.database().ref(`/User/`+this.User.uid);
        users.once('value', snapshot=> {
            
            var updates = {};
            updates['/User/' + this.User.uid] = {user_name:this.testtest};
            if(check){
              check=false;
              firebase.database().ref().update(updates);
              this.presentSuccesAlert();
            }
        });
        users.off;
      }else{
        this.presentFailedAlert();
      }
    
  }
  
  presentSuccesAlert() {
    //alert om aan te geven dat de usernaam succesvol geupdate is
    let alert = this.alertCtrl.create({
      title: 'Succes',
      subTitle: 'Your username has been updated',
      buttons: [{ text:'Dismiss',
                  role: 'cancel',
                  handler: () => {
                    
                }}]
    });
    alert.present();
  }

  presentFailedAlert() {
    //alert om aan te geven dat de usernaam niet geldig is
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'The username you chose is already taken',
      buttons: [{ text:'Dismiss',
                  role: 'cancel',
                  handler: () => {
                    
                }}]
    });
    alert.present();
  }
}