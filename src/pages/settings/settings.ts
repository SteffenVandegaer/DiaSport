import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { MyApp } from '../../app/app.component';
import { NavigatePage } from '../navigate/navigate';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
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

  constructor( public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public authData: AuthProvider, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth) {
    
  }

  ionViewDidLoad() {
    
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
    this.authData.logoutUser();
    this.navCtrl.push(LoginPage);
  }

  navigate(){
    this.navCtrl.push(NavigatePage);
  }
  
  saveSettings(){
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
            this.checkName(available);
          });
      }
    }
  }

  checkName(available){
    if(available){
      const users: firebase.database.Reference = firebase.database().ref(`/User/`+this.User.uid);
      users.on('value', snapshot=> {
        var updates = {};
        updates['/User/' + this.User.uid] = {user_name:this.testtest};
        firebase.database().ref().update(updates);
        this.presentSuccesAlert();
      });
    }else{
      this.presentFailedAlert();
    }
    
  }
  
  presentSuccesAlert() {
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