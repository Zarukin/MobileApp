import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { LoadingService } from "src/app/services/loading.service";
import { ToastService } from "src/app/services/toast.service";
import "@codetrix-studio/capacitor-google-auth";
import { Plugins } from "@capacitor/core";
import firebase from "firebase/app";

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
    pager: true,
  };
  protected loginForm = this.fb.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingService: LoadingService,
    public toastService: ToastService
  ) {}

  ngOnInit() {}

  protected lockingSwipe() {
    this.slides.lockSwipes(true);
  }

  protected hintSwipe() {
    document.getElementById("swipe-hint").hidden = false;
  }

  public arriveAtLastSlide() {
    this.slides.slideTo(1);
  }

  async loginWithGoogle() {
    try {
      this.loadingService.presentLoading("En attente…");
      const googleUser = (await Plugins.GoogleAuth.signIn()) as any;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.authentication.idToken
      );
      await this.auth.signInWithCredential(credential);
      await this.router.navigate(["/", "home"]);
      this.loadingService.dismissLoading();
    } catch (error) {
      console.log(error);
      this.loadingService.dismissLoading();

      switch (error.error || error.code) {
        case "popup_closed_by_user":
          this.toastService.presentToast("La connexion a été annulée.");
          console.log(
            "Fenêtre fermée. Connexion avec Google annulée par l'utilisateur."
          );
          break;
        case "access_denied":
          this.toastService.presentToastError("Permissions non accordées.");
          console.log("Permissions non accordées.");
          break;
        case "auth/account-exists-with-different-credential":
          this.toastService.presentToastError("Le courriel est déjà utilisé.");
          console.log("Le courriel est déjà utilisé.");
          break;
        case "auth/user-disabled":
          this.toastService.presentToastError("Ce compte a été désactivé.");
          console.log("Ce compte a été désactivé.");
          break;
        default:
          console.log(error.error);
          break;
      }
    }
  }

  protected async onSubmit() {
    try {
      await this.loadingService.presentLoading("Connexion en cours…");
      const email = this.loginForm.get("email").value;
      const password = this.loginForm.get("password").value;
      await this.auth.signInWithEmailAndPassword(email, password);
      await this.router.navigate(["/", "home"]);
      this.loadingService.dismissLoading();
    } catch (error) {
      this.loadingService.dismissLoading();

      switch (error.code) {
        case "auth/invalid-email":
          this.toastService.presentToastError("Le courriel n'est pas valide.");
          console.log("Le courriel n'est pas valide.");
          break;
        case "auth/user-not-found":
          this.toastService.presentToastError(
            "Courriel ou mot de passe incorrect."
          );
          this.toastService.presentToastForgotPassword();
          console.log("Courriel ou mot de passe incorrect.");
          break;
        case "auth/wrong-password":
          this.toastService.presentToastError(
            "Courriel ou mot de passe incorrect."
          );
          this.toastService.presentToastForgotPassword();
          console.log("Courriel ou mot de passe incorrect.");
          break;
        case "auth/user-disabled":
          this.toastService.presentToastError("Ce compte a été désactivé.");
          console.log("Ce compte a été désactivé.");
          break;
        default:
          this.toastService.presentToastError(error.message);
          // console.log(error.message);
          break;
      }
    }
  }
}
