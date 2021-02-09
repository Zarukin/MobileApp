import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { LoadingService } from "src/app/services/loading.service";
import { ToastService } from "src/app/services/toast.service";

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
    private loadingService: LoadingService,
    public toastService: ToastService
  ) {}

  ngOnInit() {}

  protected lockingSwipe() {
    this.slides.lockSwipes(true);
  }

  public arriveAtLastSlide() {
    this.slides.slideTo(1);
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
          this.toastService.presentToastError("Ce compte à été désactivé.");
          console.log("Ce compte à été désactivé.");
          break;
        default:
          this.toastService.presentToastError(error.message);
          // console.log(error.message);
          break;
      }
    }
  }
}