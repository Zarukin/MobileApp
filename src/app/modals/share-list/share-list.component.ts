import { Component,Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list';

@Component({
  selector: "app-share-list",
  templateUrl: "./share-list.component.html",
  styleUrls: ["./share-list.component.scss"],
})
export class ShareListComponent implements OnInit {
  @Input() list: List;
  public shareForm: FormGroup;

  constructor(public modalController: ModalController, public fb: FormBuilder, private afs: AngularFirestore ){
    this.shareForm = this.fb.group({
      shareEmail: ["", Validators.required],
      shareRW: [""],
    });
  }

  ngOnInit() {}

  onFormSubmit() {
    if (this.shareForm.get("shareRW").value === "read" ) {
      this.list.canRead.push(this.shareForm.get("shareEmail").value);
      this.afs.collection("lists").doc(this.list.id).update({ canRead: this.list.canRead });
    } else {
      this.list.canWrite.push(this.shareForm.get("shareEmail").value);
      this.afs.collection("lists").doc(this.list.id).update({ canWrite: this.list.canWrite });
    }
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
