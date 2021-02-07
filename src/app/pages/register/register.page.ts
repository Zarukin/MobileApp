import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  protected registerForm = this.fb.group(
    {
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          /* *
           * ^ represents starting character of the string.
           * (?=.*?[A-Z]) : At least one upper case English letter
           * (?=.*?[a-z]) : At least one lower case English letter
           * (?=.*?[0-9]) : At least one digit
           * (?=.*?[#?!@$ %^&*-]) : At least one special character or space
           * .{8,} : Minimum eight in length
           * $ represents the end of the string.
           * */ Validators.pattern(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
          ),
        ],
      ],
      confirmPassword: ["", Validators.required],
    },
    {
      validator: this.mustMatch("password", "confirmPassword"),
    }
  );

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Inscription en cours…",
      spinner: "dots",
    });
    await loading.present();

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

  private async presentToastForEmailConfirmation() {
    const toast = await this.toastController.create({
      header: "Vous être maintenant enregistré !",
      message: "Veuillez aller vérifier vos courriels pour confirmer votre adresse. Sans cela, vous ne pourrez pas réinitialiser votre mot de passe en cas de perte.",
      position: "bottom",
      color: "success",
    });
    toast.present();
  }

  protected async onSubmit() {
    this.presentLoading();
    const email = this.registerForm.get("email").value;
    const password = this.registerForm.get("password").value;

    try {
      const accountCreated = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await accountCreated.user.sendEmailVerification();
      await this.router.navigate(["/", "home"]);
      this.presentToastForEmailConfirmation();
      this.dismissLoading();
    } catch (error) {
      this.dismissLoading();

      switch (error.code) {
        case "auth/email-already-in-use":
          this.presentToast("Le courriel est déjà utilisé.");
          console.log("ERREUR : Le courriel est déjà utilisé.");
          break;
        case "auth/invalid-email":
          this.presentToast("Le courriel n'est pas valide.");
          console.log("ERREUR : Le courriel n'est pas valide.");
          break;
        default:
          this.presentToast(error.message);
          console.log(error.message);
          break;
      }
    }
  }

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustmatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustmatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
