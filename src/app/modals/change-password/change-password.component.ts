import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import firebase from "firebase/app";
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  public newPasswordForm: FormGroup;

  constructor(
    private auth: AngularFireAuth,
    private modalController: ModalController,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.newPasswordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
            ),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: this.mustMatch("newPassword", "confirmPassword"),
      }
    );
  }

  ngOnInit() {}

  async onFormSubmit() {
    try {
      const currentPassword = this.newPasswordForm.get("currentPassword").value;
      const password = this.newPasswordForm.get("newPassword").value;

      const user = await this.auth.currentUser;
      const email = user.email;
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      await user.updatePassword(password);

      this.modalController.dismiss();
      this.toastService.presentToastSuccess(
        "Mot de passe modifié avec succès."
      );
    } catch (error) {
      console.log(error);
      this.modalController.dismiss();

      switch (error.code) {
        case "auth/wrong-password":
          this.toastService.presentToastError("Le mot de passe est incorrect.");
          console.log("Le mot de passe est incorrect.");
          break;
        case "auth/weak-password":
          this.toastService.presentToastError(
            "Le nouveau mot de passe n'est pas assez fort."
          );
          console.log("Le nouveau mot de passe n'est pas assez fort.");
          break;
        default:
          this.toastService.presentToastError(error.code);
          console.log(error.code);
          break;
      }
    }
  }

  dismissModal() {
    this.modalController.dismiss();
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
