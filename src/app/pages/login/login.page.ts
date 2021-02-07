import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonSlides, LoadingController, ToastController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("mySlider") private slides: IonSlides;
  protected slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  protected loginForm = this.fb.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  protected lockingSwipe() {
    this.slides.lockSwipes(true);
  }

  public arriveAtLastSlide() {
    this.slides.slideTo(1);
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Connexion en cours…",
      spinner: "dots",
    });
    return loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  private async dismissLoading() {
    await this.loadingController.dismiss();
    console.log("dismissed");
  }

  private async presentToast(message: string) {
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

  private async presentToastWithForgotPasswordButton() {
    const toast = await this.toastController.create({
      cssClass: "my-custom-toast",
      position: "top",
      buttons: [
        {
          side: "start",
          text: "Mot de passe oublié ?",
          handler: () => {
            console.log("Forgot password clicked YES");
            this.router.navigate(["/", "password-recovery"]);
          },
        },
        {
          side: "end",
          text: "Non",
          role: "cancel",
          handler: () => {
            console.log("Forgot password clicked NO");
          },
        },
      ],
    });
    toast.present();
  }

  protected async onSubmit() {
    try {
      await this.presentLoading();
      const email = this.loginForm.get("email").value;
      const password = this.loginForm.get("password").value;
      await this.auth.signInWithEmailAndPassword(email, password);
      await this.router.navigate(["/", "home"]);
      this.dismissLoading();
    } catch (error) {
      this.dismissLoading();

      switch (error.code) {
        case "auth/invalid-email":
          this.presentToast("Le courriel n'est pas valide.");
          console.log("Le courriel n'est pas valide.");
          break;
        case "auth/user-not-found":
          this.presentToast("Courriel ou mot de passe incorrect.");
          this.presentToastWithForgotPasswordButton();
          console.log("Courriel ou mot de passe incorrect.");
          break;
        case "auth/wrong-password":
          this.presentToast("Courriel ou mot de passe incorrect.");
          this.presentToastWithForgotPasswordButton();
          console.log("Courriel ou mot de passe incorrect.");
          break;
        case "auth/user-disabled":
          this.presentToast("Ce compte à été désactivé.");
          console.log("Ce compte à été désactivé.");
          break;
        default:
          this.presentToast(error.message);
          console.log(error.message);
          break;
      }
    }
  }
}
