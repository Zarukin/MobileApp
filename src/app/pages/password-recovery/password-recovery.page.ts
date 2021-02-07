import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: "app-password-recovery",
  templateUrl: "./password-recovery.page.html",
  styleUrls: ["./password-recovery.page.scss"],
})
export class PasswordRecoveryPage implements OnInit {
  passwordRecoveryForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Veuillez patienter…",
      spinner: "dots",
    });
    return loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
    console.log("dismissed");
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: "bottom",
      color: "danger",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  async presentToastSuccess(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
      position: "bottom",
      color: "success",
      buttons: [
        {
          side: "end",
          text: "D'accord",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }

  async onSubmit() {
    try {
      await this.presentLoading();
      const email = this.passwordRecoveryForm.get("email").value;
      await this.auth.sendPasswordResetEmail(email);
      this.presentToastSuccess("Si ce compte existe vous allez recevoir un courriel pour réinitialiser votre mot de passe.");
      await this.router.navigate(["/", "login"]);
      this.dismissLoading();
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          this.dismissLoading();
          this.presentToast("Le courriel n'est pas valide.");
          console.log("Le courriel n'est pas valide.");
          break;
        case "auth/user-not-found":
          this.presentToastSuccess(
            "Si ce compte existe vous allez recevoir un courriel pour réinitialiser votre mot de passe."
          );
          await this.router.navigate(["/", "login"]);
          this.dismissLoading();
          break;
        default:
          this.dismissLoading();
          this.presentToast(error.message);
          console.log(error.message);
          break;
      }
    }
  }
}
