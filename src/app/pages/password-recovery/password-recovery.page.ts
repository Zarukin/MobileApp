import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: "app-password-recovery",
  templateUrl: "./password-recovery.page.html",
  styleUrls: ["./password-recovery.page.scss"],
})
export class PasswordRecoveryPage implements OnInit {
  passwordRecoveryForm = this.fb.group({
    email: ["", [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async onSubmit() {
    try {
      await this.loadingService.presentLoading("Veuillez patienter…");
      const email = this.passwordRecoveryForm.get("email").value;
      await this.auth.sendPasswordResetEmail(email);
      this.toastService.presentToastSuccess("Si ce compte existe vous allez recevoir un courriel pour réinitialiser votre mot de passe.");
      await this.router.navigate(["/", "login"]);
      this.loadingService.dismissLoading();
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          this.loadingService.dismissLoading();
          this.toastService.presentToastError("Le courriel n'est pas valide.");
          console.log("Le courriel n'est pas valide.");
          break;
        case "auth/user-not-found":
          this.toastService.presentToastSuccess(
            "Si ce compte existe vous allez recevoir un courriel pour réinitialiser votre mot de passe."
          );
          await this.router.navigate(["/", "login"]);
          this.loadingService.dismissLoading();
          break;
        default:
          this.loadingService.dismissLoading();
          this.toastService.presentToastError(error.message);
          console.log(error.message);
          break;
      }
    }
  }
}
