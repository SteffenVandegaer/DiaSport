import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { MessagesPage } from '../messages/messages';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MessagesPage;
  tab3Root = SettingsPage;

  constructor() {
      
  }
  
}
