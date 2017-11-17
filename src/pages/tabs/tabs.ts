import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { ScannerPage } from '../scanner/scanner';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ScannerPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
