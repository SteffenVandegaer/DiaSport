import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider) {
  }

  logout(){
    this.authData.logoutUser();
    this.navCtrl.push('LoginPage');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
