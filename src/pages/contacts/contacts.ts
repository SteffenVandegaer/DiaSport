import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  private contacts:any;
  private User;
  private Test:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public authData: AuthProvider, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.Test=true;
    this.contacts=[];
    let teller=0;
    this.afAuth.authState.subscribe( user => {
      if (user&&this.Test) {
        this.User=user;
        const contacts: firebase.database.Reference = firebase.database().ref(`/Contacts/`+user.uid);
        contacts.on('value', snapshot=> {
          this.contacts=[];
          teller=0;
          snapshot.forEach((element)=>{
            const Names: firebase.database.Reference = firebase.database().ref(`/User/`+element.val().uid);
            Names.on('value', snapshott=> {
              console.log(snapshott.val());
              this.contacts[teller]=snapshott.val().user_name;
              teller++;  
            });
            this.Test=false;
            return false;
          });
        });
        
      }
      
    });
  }

  remove(link){
    this.Test=true;
    let alert = this.alertCtrl.create({
      title: 'Warning',
      subTitle: 'are you sure you want to remove '+link+' ',
      buttons: [{ text:'Apply',
                  handler: () => {
                    this.removeYes(link);
                }},
                { 
                  text:'Dismiss',
                  role: 'cancel',
                  handler: () => {
                  
                }}]
    });
    alert.present();
  }

  removeYes(link){
    this.afAuth.authState.subscribe( user => {
      if (user&&this.Test) {
        this.Test=false;
        const Connections: firebase.database.Reference = firebase.database().ref(`/User`);
        Connections.on('value', snapshot=> {
          snapshot.forEach((element)=>{
            if(element.val().user_name==link){
              const idToRemove: firebase.database.Reference=firebase.database().ref('/Contacts/'+user.uid);
              idToRemove.on('value',data=>{
                data.forEach((dat)=>{
                  if(dat.val()==element.key){
                    const recordToRemove: firebase.database.Reference=firebase.database().ref('/Contacts/'+user.uid+'/'+dat.key);
                    recordToRemove.remove();
                    return true;
                  }
                  return false;
                })
              });
              return true;
            }
            return false;
          });
        });
      }
      this.contacts=[];
      this.navCtrl.setRoot(ContactsPage);
      
    });
  }

  addUser(){
    let alert = this.alertCtrl.create({
      title: 'Add contact',
      subTitle: 'Fill out the name of the new contact you want to add',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.checkNewContact(data.username);
          }
        }
      ]
    });
    alert.present();
  }

  checkNewContact(name){
    let available=false;
    if(name!=""){
        if (this.User) {
          const users: firebase.database.Reference = firebase.database().ref(`/User`);
          users.on('value', snapshot=> {
            snapshot.forEach( element => {
              if(element.val().user_name==name && element.key != this.User.uid){
                available=true;
                return true;
              }
              return false;
            });
            this.checkName(available,name);
          });
      }
    }
  }

  checkName(available,name){
    if(available){
      const users: firebase.database.Reference = firebase.database().ref(`/Contacts/`+this.User.uid);
      users.on('value', snapshot=> {
        let id;
        snapshot.forEach((element)=>{
          id=element.key;
          return false;
        });
        id=parseInt(id)+1;
        
        var updates = {};
        updates['/Contacts/' + this.User.uid + '/' + id] = {name};
        console.log('ben hier');
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
      subTitle: 'New contact added',
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
      subTitle: 'the chosen contact wasn\'t found',
      buttons: [{ text:'Dismiss',
                  role: 'cancel',
                  handler: () => {
                    
                }}]
    });
    alert.present();
  }
}
