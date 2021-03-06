import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Calendar } from "@ionic-native/calendar/ngx";
import firebase from "firebase/app";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-todo-details",
  templateUrl: "./todo-details.page.html",
  styleUrls: ["./todo-details.page.scss"],
})
export class TodoDetailsPage implements OnInit {
  public todo: Todo;
  public parentList: List;
  public user: firebase.User;
  public isDisabled: boolean;
  public isReadonly: boolean;
  public isNative: boolean;
  public deadlineISO: string;
  public deadline: Date;
  @ViewChild("datepickerInput") datepickerInput;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    private auth: AngularFireAuth,
    private titleService: Title,
    private afs: AngularFirestore,
    private calendar: Calendar
  ) {}

  ngOnInit() {
    this.isNative = Capacitor.isNative;
    const id = this.route.snapshot.paramMap.get("id");
    let listId;
    this.route.queryParams.subscribe((params) => {
      listId = params["list"];
    });
    this.parentList = new List("", [], "");
    this.todo = new Todo("", "", false);
    this.listServices.GetAll().subscribe(() => {
      // Obligé de récupérer toutes les listes avant sinon GetOne renvoie une liste vide.
      this.parentList = this.listServices.GetOne(listId);
      console.log(this.parentList);
      this.listServices.GetTodoObservable(this.parentList).subscribe(async () => {
        // Obligé de récupérer toutes les todos avant sinon GetOne renvoie une todo vide.
        this.todo = this.listServices.GetTodo(id, this.parentList);
        console.log(this.todo);
        if (this.todo.deadline !== undefined) {
          this.deadline = this.todo.deadline.toDate();
          this.deadlineISO = this.deadline.toISOString();
        }
        this.user = await this.auth.currentUser;
        this.shouldDisable();
      });
    });
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Détail de la tâche");
  }

  updateDescription(e) {
    this.todo.description = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ description: this.todo.description });
  }
  
  updateName(e) {
    this.todo.name = e.currentTarget.value;
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ name: this.todo.name });
  }

  updateIsDone(e) {
    if (this.user !== undefined && this.parentList.canRead.indexOf(this.user.email) === -1) {
      this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ isDone: !this.todo.isDone });
    }
  }

  updateDeadline(e) {
    this.deadline = new Date(e.currentTarget.value);
    this.todo.deadline = firebase.firestore.Timestamp.fromDate(this.deadline);
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({ deadline: this.todo.deadline });
  }

  clearDate() {
    this.afs.collection("lists").doc(this.parentList.id).collection("todos").doc(this.todo.id).update({
      deadline: firebase.firestore.FieldValue.delete(),
    }).then(() => this.datepickerInput.value = "");
  }

  createEvent() {
    const deadline: Date = new Date(this.todo.deadline.toDate());
    const deadlineHour = deadline.getHours();
    const startTime = deadline.setHours(deadlineHour - 1);
    this.calendar.createEventInteractively(this.todo.name, null, this.todo.description, deadline, this.todo.deadline.toDate());
  }

  openCalendar() {
    this.calendar.openCalendar(new Date());
  }

  shouldDisable() {
    if (this.user !== undefined && this.parentList.canRead.indexOf(this.user.email) === -1) {
      this.isDisabled = false;
      this.isReadonly = false;
    } else {
      this.isDisabled = true;
      this.isReadonly = true;
    }
  }
}
