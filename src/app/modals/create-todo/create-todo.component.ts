import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";

@Component({
  selector: "app-create-todo",
  templateUrl: "./create-todo.component.html",
  styleUrls: ["./create-todo.component.scss"],
})
export class CreateTodoComponent implements OnInit {
  @Input() list: List;
  public todoForm: FormGroup;

  constructor(
    public listService: ListService,
    public modalController: ModalController,
    public fb: FormBuilder
  ) {
    this.todoForm = this.fb.group({
      todoName: ["", Validators.required],
      todoDesc: [""],
    });
  }

  ngOnInit() {}

  onFormSubmit() {
    this.listService.CreateTodo(
      this.list,
      this.todoForm.get("todoName").value,
      this.todoForm.get("todoDesc").value,
    );
    this.modalController.dismiss();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
