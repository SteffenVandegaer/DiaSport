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
  private uids:any;
  private User;
  private Test:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public authData: AuthProvider, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ben er');
    this.contacts=[];
    let teller=0;
    this.afAuth.authState.subscribe( user => {
      if (user) {
        this.User=user;
        const contacts: firebase.database.Reference = firebase.database().ref(`/Contacts/`+user.uid);
        contacts.on('value', snapshot=> {
          this.contacts=[];
          this.uids=[];
          teller=0;
          snapshot.forEach((element)=>{
            const Names: firebase.database.Reference = firebase.database().ref(`/User/`+element.val().uid);
            Names.on('value', snapshott=> {
              if(snapshott.val()!=null){
                let dataToSendToview=[];
                dataToSendToview[0]=snapshott.val().user_name;
                dataToSendToview[1]=snapshott.key;
                this.contacts[teller]=dataToSendToview;
                teller++;
              }
            });
            return false;
          });
        });
        
      }
      
    });
  }

  sendToUserYes(destinationUid){
    let testBool=true;
    
    const getId: firebase.database.Reference = firebase.database().ref(`/Connection/`+destinationUid);
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
        let uid=this.User.uid;
        var updates = {};
        var d = new Date();
        updates['/Connection/' + destinationUid+'/'+id] = {uid,time:d.getTime()};
        firebase.database().ref().update(updates);
      }
      

    });
  }

  sendToUser(destinationUid,name){
    let alert = this.alertCtrl.create({
      title: 'Warning',
      subTitle: 'Do you want to share your location with '+name+'?',
      buttons: [
                { 
                  text:'No',
                  role: 'cancel',
                  handler: () => {
                  
                }},
                { text:'Yes',
                  handler: () => {
                    this.sendToUserYes(destinationUid);
                }}
                ]
    });
    alert.present();
  }

  remove(link){
    this.Test=true;
    let alert = this.alertCtrl.create({
      title: 'Share your location',
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
      if (user) {
        const Connections: firebase.database.Reference = firebase.database().ref(`/User`);
        Connections.on('value', snapshot=> {
          snapshot.forEach((gebruiker)=>{
            console.log(gebruiker.val().user_name);
            if(gebruiker.val().user_name==link){
              const idToRemove: firebase.database.Reference=firebase.database().ref('/Contacts/'+user.uid);
              idToRemove.on('value',data=>{
                data.forEach((dat)=>{
                  if(dat.val().uid==gebruiker.key){
                    const recordToRemove: firebase.database.Reference=firebase.database().ref('/Contacts/'+user.uid+'/'+dat.key+'/uid');
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
          this.Test=false;
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
    let id;
    let testBool=true;
    if(available){
      const users: firebase.database.Reference = firebase.database().ref(`/Contacts/`+this.User.uid);
      users.on('value', snapshot=> {
        let id;
        if(snapshot.val()==null){
          id=1;
        }else{
          snapshot.forEach((element)=>{
            id=element.key;
            return false;
          });
          id=parseInt(id)+1;
        }
        let uid;
        
        const userId: firebase.database.Reference = firebase.database().ref('/User');
        userId.on('value', allUsers=> {
          allUsers.forEach((gebruiker)=>{
            if(gebruiker.val().user_name==name){
              uid=gebruiker.key;
              
              return true;
            }
            return false;
          });
          if(testBool){
            testBool=false;
            var updates = {};
            updates['/Contacts/' + this.User.uid + '/' + id] = {uid};
            firebase.database().ref().update(updates);
            this.presentSuccesAlert();
          }
        });
        
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
