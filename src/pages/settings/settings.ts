import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor( public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth) {
    
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe( user => {
      if (user) {
        const users: firebase.database.Reference = firebase.database().ref(`/User/`+user.uid);
        users.on('value', snapshot=> {
          console.log(user.uid);
          this.testtest=String(snapshot.val().user_name);
          console.log(snapshot.val().user_name);
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
    
  }

  

}