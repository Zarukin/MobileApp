import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { List } from "src/app/models/list";
import { ListService } from "src/app/services/list.service";

@Component({
  selector: "app-create-list",
  templateUrl: "./create-list.component.html",
  styleUrls: ["./create-list.component.scss"],
})
export class CreateListComponent implements OnInit {
  listForm: FormGroup;

  constructor(
    public listService: ListService,
    public modalController: ModalController,
    public fb: FormBuilder,
    private router: Router,
  ) {
    this.listForm = this.fb.group({
      listName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onFormSubmit() {
    if (this.listForm.get("listName").value === "iwanttoplaytheflags") {
      this.router.navigate(["/", "flag"]);
      this.modalController.dismiss();
      return;
    }
    this.listService.Create(this.listForm.get("listName").value);
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
