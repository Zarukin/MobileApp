import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import firebase from "firebase/app";
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent implements OnInit {
  public createAccountForm: FormGroup;

  constructor(
    public auth: AngularFireAuth,
    public modalController: ModalController,
    public fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.createAccountForm = this.fb.group(
      {
        password: [
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
        validator: this.mustMatch("password", "confirmPassword"),
      }
    );
  }

  ngOnInit() {}

  async onFormSubmit() {
    try {
      const email = (await this.auth.currentUser).email;
      const password = this.createAccountForm.get("password").value;

      const providerId = await this.auth.fetchSignInMethodsForEmail(email);
      const provider = new firebase.auth.OAuthProvider(providerId[0]);
      await (await this.auth.currentUser).reauthenticateWithPopup(provider);

      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
      await (await this.auth.currentUser).linkWithCredential(credential);
      console.log("Account linking success");

      this.modalController.dismiss();
      this.toastService.presentToastSuccess("Compte activé !");
    } catch (error) {
      console.log(error);
      this.modalController.dismiss();
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
