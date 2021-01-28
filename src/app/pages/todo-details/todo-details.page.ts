import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";

@Component({
  selector: "app-todo-details",
  templateUrl: "./todo-details.page.html",
  styleUrls: ["./todo-details.page.scss"],
})
export class TodoDetailsPage implements OnInit {
  public todo: Todo;

  constructor(public route: ActivatedRoute, public listServices: ListService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.todo = this.listServices.GetTodo(id);
  }

  updateDescription(e) {
    this.todo.description = e.currentTarget.value;
  }

  updateName(e) {
    this.todo.name = e.currentTarget.value;
  }
}
