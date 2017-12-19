import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;

  constructor(public navCtrl: NavController,afAuth: AngularFireAuth, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
      //check als de user nog ingelogd is
      const authObserver = afAuth.authState.subscribe( user => {
        if (user) {
          //open tabspagina
          this.navCtrl.push(TabsPage);
        } 
        authObserver.unsubscribe();
      });
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

  }
  
  loginUser(){
    //check login gegevens en navigeer naar de juiste pagina als de gegevens juist zijn.
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.navCtrl.push(TabsPage);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }



  goToResetPassword(){
    //laad resetPasswordPagina
    this.navCtrl.push('ResetPasswordPage');
  }

  createAccount(){
    //laad signup pagina
    this.navCtrl.push('SignupPage');
  }

}
