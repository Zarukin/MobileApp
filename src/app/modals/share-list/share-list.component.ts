import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { List } from "src/app/models/list";
import { ListService } from "src/app/services/list.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-share-list",
  templateUrl: "./share-list.component.html",
  styleUrls: ["./share-list.component.scss"],
})
export class ShareListComponent implements OnInit {
  @Input() list: List;
  public shareForm: FormGroup;
  canRWR: Map<string, string[]> = new Map<string, string[]>();
  clonedCanRead: string[];
  clonedCanWrite: string[];

  constructor(private modalController: ModalController, public fb: FormBuilder, private afs: AngularFirestore, private toastService: ToastService) {
    this.shareForm = this.fb.group({
      shareEmail: ["", Validators.required],
      shareRW: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.clonedCanRead = [...this.list.canRead];
    this.clonedCanWrite = [...this.list.canWrite];
    this.canRWR.set("canRead", this.clonedCanRead);
    this.canRWR.set("canWrite", this.clonedCanWrite);
  }

  onFormSubmit() {
    if (this.shareForm.get("shareRW").value === "read") {
      this.list.canRead.push(this.shareForm.get("shareEmail").value);
      this.clonedCanRead = [...this.list.canRead];
      this.canRWR.set("canRead", this.clonedCanRead);
      this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead });
    } else {
      this.list.canWrite.push(this.shareForm.get("shareEmail").value);
      this.clonedCanWrite = [...this.list.canWrite];
      this.canRWR.set("canWrite", this.clonedCanWrite);
      this.afs.collection("lists").doc(this.list.id).update({ canWrite: this.list.canWrite });
    }
    this.toastService.presentToastSuccessWithHeader("Partagée avec succès", "Si ce courriel existe, la personne aura accès à cette liste.");
  }

  handleSharedRead(email: string, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.list.canRead.push(email);
      this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead });
    } else {
      const indexEmail = this.list.canRead.indexOf(email);
      this.list.canRead.splice(indexEmail, 1);
      this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead });
    }
  }

  handleSharedWrite(email: string, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.list.canWrite.push(email);
      this.afs.collection("lists").doc(this.list.id).update({ canWrite: this.list.canWrite });
    } else {
      const indexEmail = this.list.canWrite.indexOf(email);
      this.list.canWrite.splice(indexEmail, 1);
      this.afs.collection("lists").doc(this.list.id).update({ canWrite: this.list.canWrite });
    }
  }

  triggerSwitchToRead(email: string) {
    const indexEmail = this.list.canWrite.indexOf(email);
    this.list.canWrite.splice(indexEmail, 1);
    this.list.canRead.push(email);
    this.clonedCanRead = [...this.list.canRead];
    this.clonedCanWrite = [...this.list.canWrite];
    this.canRWR.set("canRead", this.clonedCanRead);
    this.canRWR.set("canWrite", this.clonedCanWrite);
    this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead, canWrite: this.list.canWrite });
  }

  triggerSwitchToWrite(email: string) {
    const indexEmail = this.list.canRead.indexOf(email);
    this.list.canRead.splice(indexEmail, 1);
    this.list.canWrite.push(email);
    this.clonedCanRead = [...this.list.canRead];
    this.clonedCanWrite = [...this.list.canWrite];
    this.canRWR.set("canRead", this.clonedCanRead);
    this.canRWR.set("canWrite", this.clonedCanWrite);
    this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead, canWrite: this.list.canWrite });
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
