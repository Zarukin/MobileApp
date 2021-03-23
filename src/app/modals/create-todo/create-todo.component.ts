import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { List } from "src/app/models/list";
import { ListService } from "src/app/services/list.service";
import firebase from "firebase/app";

@Component({
  selector: "app-create-todo",
  templateUrl: "./create-todo.component.html",
  styleUrls: ["./create-todo.component.scss"],
})
export class CreateTodoComponent implements OnInit {
  @Input() list: List;
  public todoForm: FormGroup;
  public isoDateString: string;
  public deadline: Date;

  constructor(public listService: ListService, public modalController: ModalController, public fb: FormBuilder) {
    this.todoForm = this.fb.group({
      todoName: ["", Validators.required],
      todoDesc: [""],
      todoDeadline: [""]
    });
  }

  ngOnInit() {}

  getDate() {
    this.isoDateString = new Date().toISOString();
  }

  onFormSubmit() {
    if (this.todoForm.get("todoDeadline").value !== "") {
      this.deadline = new Date(this.todoForm.get("todoDeadline").value);
      this.listService.CreateTodo(
        this.list,
        this.todoForm.get("todoName").value,
        this.todoForm.get("todoDesc").value,
        firebase.firestore.Timestamp.fromDate(this.deadline)
      );
    } else {
      this.listService.CreateTodo(
        this.list,
        this.todoForm.get("todoName").value,
        this.todoForm.get("todoDesc").value
      );
    }
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
