import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list';

@Component({
  selector: "app-list-settings",
  templateUrl: "./list-settings.component.html",
  styleUrls: ["./list-settings.component.scss"],
})
export class ListSettingsComponent implements OnInit {
  @Input() list: List;
  listSettingsForm: FormGroup;

  constructor(public modalController: ModalController, public fb: FormBuilder, private afs: AngularFirestore) {}

  ngOnInit() {
    this.listSettingsForm = this.fb.group({
      newListName: [this.list.name, Validators.required],
      listColour: [this.list.colour, Validators.required],
    });
  }

  onFormSubmit() {
    const name = this.listSettingsForm.get("newListName").value;
    const colour = this.listSettingsForm.get("listColour").value;
    this.afs.collection("lists").doc(this.list.id).update({ name, colour });
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
