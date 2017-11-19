import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { NFC, Ndef } from '@ionic-native/nfc';

/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})



export class ScannerPage{

  public tag;
  
  constructor(private nfc: NFC, private ndef: Ndef, platform: Platform,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private androidPermissions: AndroidPermissions) {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.NFC);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.NFC).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.NFC)
    );

    platform.ready().then(() => {
      this.nfc.addNdefListener().subscribe(nfcData => {
        console.log("Received NFC tag: " + JSON.stringify(nfcData));
      });
  });
  }
}