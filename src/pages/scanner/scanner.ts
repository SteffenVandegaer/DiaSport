import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { NFC, Ndef } from '@ionic-native/nfc';
import { NfcvService } from '../../../plugins/cordova-nfcv-plugin/ionic2';

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



export class ScannerPage implements OnInit{

  public tag;
  
  constructor(platform: Platform,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private androidPermissions: AndroidPermissions, public nfcvService: NfcvService,private nfc: NFC, private ndef: Ndef) {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.NFC);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.NFC).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.NFC)
    );

    platform.ready().then(() => {
      //nfcvService.waitForNdef();
      this.nfc.addNdefFormatableListener(()=>
        console.log('deze 2 successfully attached ndef listener');
      }, (err) => {
        console.log('deze 2 error attaching ndef listener', err);
      }).then((event) => {
        console.log('deze 2 received ndef message. the tag contains: ' + event.tag.toString());
        console.log('deze 2 decoded tag id' + this.nfc.bytesToHexString(event.tag.id));
      });
      /*this.nfc.addTagDiscoveredListener().subscribe(res => {
        
        console.log("deze 2 res " + JSON.stringify(res.tag));
      },(err) => console.log(err));
      /*this.nfc.addTagDiscoveredListener(() => {
        console.log('deze 2 successfully attached ndef listener');
      }, (err) => {
        console.log('deze 2 error attaching ndef listener', err);
      }).subscribe((event) => {
        console.log('deze 2 received ndef message. the tag contains: ' + event.tag.toString());
        console.log('deze 2 decoded tag id' + this.nfc.bytesToHexString(event.tag.id));
      });*/
  }

  ngOnInit() {
    this.nfcvService.onNdef(
      (tag) => {
        //Avoid reading null tag on first call
        if (tag) {
          console.log('deze 2 Found tag:', tag);
          this.tag = tag;
        }
      },
      (error) => {
        //Avoid reading null tag on first call
        if (error) {
          console.log('deze 2 Error tag:', error);
        }
      }
    );
  }

  read() {
    var device = {"regexp": new RegExp('^AIR\-SAVER v[0-9\.]+$', 'i')};
    this.nfcvService.
    read([
      { block: new Uint8Array([0x18]) },
      { block: new Uint8Array([0x19]) }
    ], true, device)
        .then((data) => {
          console.log("deze 2"+data);
        });
  }

}