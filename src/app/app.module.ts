import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { ScannerPage } from '../pages/scanner/scanner';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { NFC,Ndef } from '@ionic-native/nfc';
import { AndroidPermissions } from '@ionic-native/android-permissions';


import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA43tuYz9kTRECR4Du1mnycRbsAblaSGAg",
  authDomain: "diasports-67224.firebaseapp.com",
  databaseURL: "https://diasports-67224.firebaseio.com",
  projectId: "diasports-67224",
  storageBucket: "diasports-67224.appspot.com",
  messagingSenderId: "529704432993"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SettingsPage,
    HomePage,
    TabsPage,
    ScannerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SettingsPage,
    HomePage,
    TabsPage,
    ScannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    NFC,
    Ndef,
    AndroidPermissions
  ]
})
export class AppModule {}
