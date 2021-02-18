import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { RoutingService } from 'src/app/services/routing.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  public registerForm = this.fb.group(
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
    private routeService: RoutingService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.routeService.subscribeRoute();
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Inscription");
  }

  public async onSubmit() {
    this.loadingService.presentLoading("Inscription en cours…");
    const email = this.registerForm.get("email").value;
    const password = this.registerForm.get("password").value;

    try {
      const accountCreated = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await accountCreated.user.sendEmailVerification();
      await this.router.navigate(["/", "home"]);
      this.toastService.presentToastSuccessSignUp();
      this.loadingService.dismissLoading();
    } catch (error) {
      this.loadingService.dismissLoading();

      switch (error.code) {
        case "auth/email-already-in-use":
          this.toastService.presentToastError("Le courriel est déjà utilisé.");
          console.log("ERREUR : Le courriel est déjà utilisé.");
          break;
        case "auth/invalid-email":
          this.toastService.presentToastError("Le courriel n'est pas valide.");
          console.log("ERREUR : Le courriel n'est pas valide.");
          break;
        default:
          this.toastService.presentToastError(error.message);
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
