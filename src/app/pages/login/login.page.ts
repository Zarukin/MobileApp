import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { LoadingService } from "src/app/services/loading.service";
import { ToastService } from "src/app/services/toast.service";
import { cfaSignIn } from "capacitor-firebase-auth";
import firebase from "firebase/app";
import { Title } from "@angular/platform-browser";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("mySlider") private slides: IonSlides;
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    pager: true,
  };
  public loginForm = this.fb.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });
  public isNative: boolean;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingService: LoadingService,
    public toastService: ToastService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.isNative = Capacitor.isNative;
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Connexion");
  }

  public lockingSwipe() {
    this.slides.lockSwipes(true);
  }

  public hintSwipe() {
    document.getElementById("swipe-hint").hidden = false;
  }

  public arriveAtLastSlide() {
    this.slides.slideTo(1);
  }

  public async loginWithGitHub() {}

  public async loginWithSocial(social: string) {
    this.loadingService.presentLoading("En attente…");
    cfaSignIn(social)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.loadingService.dismissLoading();
          return throwError(error);
        })
      )
      .subscribe(
        async (user: firebase.User) => {
          console.log(user.displayName);
          if (!user.emailVerified) {
            await user.sendEmailVerification();
          }
          await this.router.navigate(["/", "home"]);
          this.loadingService.dismissLoading();
        },
        (err) => {
          console.log(err.code);
          switch (err.code || err.message) {
            case "auth/popup-closed-by-user":
              this.toastService.presentToast("La connexion a été annulée.");
              console.log("Fenêtre fermée. Connexion OAuth annulée par l'utilisateur.");
              break;
            case "auth/user-cancelled":
              this.toastService.presentToast("La connexion a été annulée.");
              console.log("Connexion annulée. Connexion OAuth annulée par l'utilisateur.");
              break;
            case "auth/account-exists-with-different-credential":
              this.toastService.presentToastError("Le courriel est déjà utilisé par un autre service.");
              console.log("Le courriel est déjà utilisé par un autre service.");
              break;
            case "auth/user-disabled":
              this.toastService.presentToastError("Ce compte a été désactivé.");
              console.log("Ce compte a été désactivé.");
              break;
            case "Facebook Sign In cancel.":
              this.toastService.presentToast("La connexion a été annulée.");
              console.log("La connexion a été annulée.");
              break;
            case "Twitter Sign In failure.":
              this.toastService.presentToast("La connexion a été annulée.");
              console.log("La connexion a été annulée.");
              break;
            case "Google Sign In failure.":
              this.toastService.presentToast("La connexion a été annulée.");
              console.log("La connexion a été annulée.");
              break;
            default:
              this.toastService.presentToastError(err.message);
              console.log(err.message);
              break;
          }
        }
      );
  }

  public async onSubmit() {
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
          this.toastService.presentToastError("Courriel ou mot de passe incorrect.");
          this.toastService.presentToastForgotPassword();
          console.log("Courriel ou mot de passe incorrect.");
          break;
        case "auth/wrong-password":
          this.toastService.presentToastError("Courriel ou mot de passe incorrect.");
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
