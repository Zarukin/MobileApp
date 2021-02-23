import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingService } from 'src/app/services/loading.service';
import firebase from "firebase/app";
import { ToastService } from 'src/app/services/toast.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from 'src/app/modals/change-password/change-password.component';
import { ChangeEmailComponent } from 'src/app/modals/change-email/change-email.component';
import { CreateAccountComponent } from 'src/app/modals/create-account/create-account.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPage implements OnInit {
  public currentUser: firebase.User;
  public userEmail: string;
  public signInMethods: string[] = [];
  public emailVerified: boolean;
  public sendEmailVerificationClicked = false;

  constructor(
    private auth: AngularFireAuth,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private titleService: Title
  ) {}

  async ngOnInit() {
    await this.fetchUserEmail();
    await this.fetchConnectedAccount();
    this.emailVerified = this.currentUser.emailVerified;
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Mon compte");
  }

  private async fetchUserEmail() {
    this.currentUser = await this.auth.currentUser;
    this.userEmail = this.currentUser.email;
  }

  private async fetchConnectedAccount() {
    this.signInMethods = await this.auth.fetchSignInMethodsForEmail(
      this.currentUser.email
    );
    console.log("Sign in methods: " + this.signInMethods.toString());
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public handleSocial(social: string) {
    if (this.signInMethods.includes(social)) {
      if (social === "password") {
        this.toastService.presentToast(
          "Vous ne pouvez pas désactiver votre compte Todos."
        );
        console.log("Compte Todos clicked");
        return null;
      } else {
        if (this.signInMethods.length <= 1) {
          this.toastService.presentToast(
            "Vous devez être connecté avec au moins un compte."
          );
          return null;
        } else {
          this.presentAlertCheckbox(social);
        }
      }
    } else {
      if (social === "password") {
        this.presentModalCreateAccount();
      } else {
        this.linkWithSocial(social);
      }
    }
  }

  private async linkWithSocial(social: string) {
    try {
      let provider = null;
      this.loadingService.presentLoading("En attente…");
      if (social === "google.com") {
        provider = new firebase.auth.GoogleAuthProvider();
        console.log("Linked with Google");
      }
      if (social === "github.com") {
        provider = new firebase.auth.GithubAuthProvider();
        console.log("Linked with GitHub");
      } else if (social === "twitter.com") {
        provider = new firebase.auth.TwitterAuthProvider();
        console.log("Linked with Twitter");
      } else if (social === "facebook.com") {
        provider = new firebase.auth.FacebookAuthProvider();
        console.log("Linked with Facebook");
      }
      await this.currentUser.linkWithPopup(provider);
      await this.fetchConnectedAccount();
      this.loadingService.dismissLoading();
    } catch (error) {
      console.log(error);
      this.loadingService.dismissLoading();

      switch (error.code) {
        case "auth/popup-closed-by-user":
          this.toastService.presentToast("La connexion a été annulée.");
          console.log(
            "Fenêtre fermée. Connexion OAuth annulée par l'utilisateur."
          );
          break;
        default:
          this.toastService.presentToastError(error.code);
          console.log(error.code);
          break;
      }
    }
  }

  private async unlinkSocial(social: string) {
    try {
      this.loadingService.presentLoading("En attente…");
      if (social === "google.com") {
        await this.currentUser.unlink("google.com");
      } else if (social === "github.com") {
        await this.currentUser.unlink("github.com");
      } else if (social === "twitter.com") {
        await this.currentUser.unlink("twitter.com");
      } else if (social === "facebook.com") {
        await this.currentUser.unlink("facebook.com");
      }
      await this.fetchConnectedAccount();
      this.loadingService.dismissLoading();
    } catch (error) {
      console.log(error);
      this.loadingService.dismissLoading();

      switch (error.code) {
        default:
          this.toastService.presentToastError(error.code);
          console.log(error.code);
          break;
      }
    }
  }

  public async sendConfirmationEmail() {
    this.currentUser.sendEmailVerification();
    this.toastService.presentToastSuccess("Courriel de vérification envoyé.");
    await this.delay(60000); // 60 secondes
    console.log("Send confirmation email button available again.");
    this.sendEmailVerificationClicked = false;
  }

  private async deleteAccount(confirmation: string) {
    try {
      if (this.signInMethods.includes("password")) {
        const userEmail = this.currentUser.email;
        const credential = firebase.auth.EmailAuthProvider.credential(
          userEmail,
          confirmation
        );
        await this.currentUser.reauthenticateWithCredential(credential);
      } else {
        if (confirmation !== "Je veux supprimer mon compte") {
          const error = new Error("Incorrect sentence");
          error.name = "incorrect-sentence";
          throw error;
        } else {
          const providerId = await this.auth.fetchSignInMethodsForEmail(
            this.currentUser.email
          );
          const provider = new firebase.auth.OAuthProvider(providerId[0]);
          await this.currentUser.reauthenticateWithPopup(provider);
        }
      }
      await this.currentUser.delete();
      await this.router.navigate(["/", "login"]);
      this.toastService.presentToastSuccess("Compte supprimé !");
    } catch (error) {
      console.log(error);

      switch (error.code || error.name) {
        case "auth/wrong-password":
          this.toastService.presentToastError(
            "Le mot de passe est incorrect, annulation."
          );
          console.log("Le mot de passe est incorrect, annulation.");
          break;
        case "incorrect-sentence":
          this.toastService.presentToastError("Phrase incorrecte, annulation.");
          console.log("Phrase incorrecte, annulation.");
          break;
        default:
          this.toastService.presentToastError(error.code);
          console.log(error.code);
          break;
      }
    }
  }

  public async presentModalPassword() {
    const modal = await this.modalController.create({
      component: ChangePasswordComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: {},
    });
    return await modal.present();
  }

  public async presentModalEmail() {
    const modal = await this.modalController.create({
      component: ChangeEmailComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: {},
    });
    return await modal.present();
  }

  private async presentModalCreateAccount() {
    const modal = await this.modalController.create({
      component: CreateAccountComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: {},
    });
    return await modal.present();
  }

  private async presentAlertCheckbox(social: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Retrait du fournisseur",
      message:
        "Êtes-vous certain de vouloir retirer ce fournisseur ? <br> <small>Vous ne pourrez plus vous connecter avec.</small>",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {
            console.log("Canceled unlink!");
          },
        },
        {
          text: "Oui, retirer",
          handler: () => {
            console.log("Confirm unlink provider!");
            this.unlinkSocial(social);
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    console.log("Alert dismissed!");
  }

  public async presentAlertDeletion() {
    const alert = await this.alertController.create({
      cssClass: "alert-popup",
      header: "Suppression du compte",
      message:
        "Êtes-vous certain de vouloir supprimer votre compte ? <br> <small> Cette action est définitive. Vous perdrez toutes vos listes et toutes vos tâches.</small>",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {
            console.log("Canceled deletion!");
          },
        },
        {
          text: "Oui, supprimer",
          cssClass: "destructive-action",
          handler: async () => {
            console.log("Confirm deletion!");
            if (this.signInMethods.includes("password")) {
              this.presentAlertDeletionConfirmWithPassword();
            } else {
              this.presentAlertDeletionConfirmWithSentence();
            }
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    console.log("Alert dismissed!");
  }

  private async presentAlertDeletionConfirmWithPassword() {
    const alert = await this.alertController.create({
      cssClass: "alert-popup",
      header: "⚠ Dernière chance !",
      subHeader: "Après ça, votre compte sera définitivement supprimé",
      message: "Veuillez confirmer votre mot de passe",
      inputs: [
        {
          name: "password",
          cssClass: "alert-password-input",
          type: "password",
          placeholder: "Mot de passe",
        },
      ],
      buttons: [
        {
          text: "Tout annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {
            console.log("Deletion process canceled!");
          },
        },
        {
          text: "Supprimer",
          cssClass: "destructive-action",
          handler: async (inputValue) => {
            console.log("Deletion process launched!");
            this.deleteAccount(inputValue.password);
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    console.log("Alert dismissed!");
  }

  private async presentAlertDeletionConfirmWithSentence() {
    const alert = await this.alertController.create({
      cssClass: "alert-popup",
      header: "⚠ Dernière chance !",
      subHeader: "Après ça, votre compte sera définitivement supprimé",
      message:
        "Veuillez recopier la phrase suivante : <br><br> <strong><small>« Je veux supprimer mon compte »</small></strong>",
      inputs: [
        {
          name: "confirmation_sentence",
          cssClass: "alert-password-input",
          type: "text",
          placeholder: "Recopiez la phrase ci-dessus",
        },
      ],
      buttons: [
        {
          text: "Tout annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {
            console.log("Deletion process canceled!");
          },
        },
        {
          text: "Supprimer",
          cssClass: "destructive-action",
          handler: async (inputValue) => {
            console.log("Deletion process launched!");
            this.deleteAccount(inputValue.confirmation_sentence);
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    console.log("Alert dismissed!");
  }
}
