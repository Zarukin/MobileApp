import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { ListService } from 'src/app/services/list.service';
import { List } from 'src/app/models/list';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: "app-change-email",
  templateUrl: "./change-email.component.html",
  styleUrls: ["./change-email.component.scss"],
})
export class ChangeEmailComponent implements OnInit {
  public newEmailForm: FormGroup;
  signInMethods: string[] = [];
  currentUser: firebase.User;
lists : List[];
  constructor(
    private auth: AngularFireAuth,
    private modalController: ModalController,
    private fb: FormBuilder,
    private toastService: ToastService,
    private listService: ListService,
    private afs: AngularFirestore,
    public router: Router
  ) {
    this.newEmailForm = this.fb.group({
      newEmail: ["", Validators.required],
      password: [""],
    });
  }

  async ngOnInit() {
    this.currentUser = await this.auth.currentUser;
    const email = this.currentUser.email;
    this.signInMethods = await this.auth.fetchSignInMethodsForEmail(email);
  }

  async onFormSubmit() {
    try {
      const email = this.newEmailForm.get("newEmail").value;

      if (this.signInMethods.includes("password")) {
        const userEmail = this.currentUser.email;
        const password = this.newEmailForm.get("password").value;
        const credential = firebase.auth.EmailAuthProvider.credential(
          userEmail,
          password
        );
        await this.currentUser.reauthenticateWithCredential(credential);
      } else {
        const providerId = await this.auth.fetchSignInMethodsForEmail(email);
        const provider = new firebase.auth.OAuthProvider(providerId[0]);
        await this.currentUser.reauthenticateWithPopup(provider);
      }
      for (const list  of this.listService.GetListWithoutRefresh()) {
        if (list.owner == this.currentUser.email){
           await  this.afs.collection("lists").doc(list.id).update({ owner: email });
          }else if (list.canWrite.indexOf(this.currentUser.email) > -1) {
             list.canWrite[list.canWrite.indexOf(this.currentUser.email)] = email;
            await this.afs.collection("lists").doc(list.id).update({ canWrite: list.canWrite });
          }else if (list.canRead.indexOf(this.currentUser.email) > -1 ){
            list.canRead[list.canRead.indexOf(this.currentUser.email)] = email;
             await this.afs.collection("lists").doc(list.id).update({ canRead:  list.canRead});
          }
        }

      await this.currentUser.updateEmail(email);
      
      this.modalController.dismiss();
      this.toastService.presentToastSuccess(
        "Courriel modifié avec succès."
      );
      this.listService.ResetServicesForNewUser();
    } catch (error) {
      console.log(error);
      this.modalController.dismiss();

      switch (error.code) {
        case "auth/wrong-password":
          this.toastService.presentToastError("Le mot de passe est incorrect.");
          console.log("Le mot de passe est incorrect.");
          break;
        case "auth/email-already-in-use":
          this.toastService.presentToastError("Ce courriel est déjà utilisé.");
          console.log("Ce courriel est déjà utilisé.");
          break;
        case "auth/invalid-email":
          this.toastService.presentToastError("Le courriel n'est pas valide.");
          console.log("Le courriel n'est pas valide.");
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
}
