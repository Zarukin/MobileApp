import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, Subscription ,combineLatest} from "rxjs";
import { map } from 'rxjs/operators';
import { List } from "../models/list";
import { Todo } from "../models/todo";
import firebase from "firebase/app";
import { SelectMultipleControlValueAccessor } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ListService {
  private lists: List[];
  listsObservable: Observable<List[]>;
  listsCollection: AngularFirestoreCollection<List>;
  private user: firebase.User;
  private userSub: Subscription;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.lists = [];
    this.userSub = this.auth.user.subscribe((user) => {
      if (user) { 
        this.user = user;

      }
    });

      this.listsObservable = this.orQuery();
   
      this.listsObservable.subscribe((lists) => {
        console.log(lists);
        lists.forEach(element => {
          if (element.todos === undefined) {
            element.todos = [];
          }
          if (element.canRead === undefined) {
            element.canRead = [];
          }
          if (element.canWrite === undefined) {
            element.canWrite = [];
          }
        });
        this.lists = lists.filter((list) => {
          return list.owner === this.user.email || list.canRead.indexOf(this.user.email) !== -1 ||
            list.canWrite.indexOf(this.user.email) !== -1;
        });
      });
      

    }



    private orQuery() :Observable<List[]> {
      this.listsCollection = this.afs.collection<List>("lists", ref => ref.where("owner", "==", firebase.auth().currentUser.email));
      const owner = this.listsCollection.valueChanges();
     const read =  this.afs.collection<List>("lists", ref => ref.where("canRead", "array-contains", firebase.auth().currentUser.email)).valueChanges();
      const write =  this.afs.collection<List>("lists", ref => ref.where("canWrite", "array-contains", firebase.auth().currentUser.email)).valueChanges();
      return combineLatest([owner,write,read]).pipe(
          map(([owner, write,read]) => [...owner, ...write,...read])
);
  }
  

  ResetServicesForNewUser(){
    this.lists = [];
    this.listsObservable = this.orQuery();
        this.listsObservable.subscribe((lists) => {
          console.log(lists);
          lists.forEach(element => {
            if (element.todos === undefined) {
              element.todos = [];
            }
            if (element.canRead === undefined) {
              element.canRead = [];
            }
            if (element.canWrite === undefined) {
              element.canWrite = [];
            }
          });
          this.lists = lists.filter((list) => {
            return list.owner === this.user.email || list.canRead.indexOf(this.user.email) !== -1 ||
              list.canWrite.indexOf(this.user.email) !== -1;
          });
        });
  }

  public GetListWithoutRefresh(): List[]{
        return this.lists;
  }

   GetAll(): Observable<List[]> { 
    return this.listsObservable;
  }

  GetOne(id: string): List {
    return this.lists.find((list) => list.id === id);
  }

  GetTodo(id: string, parentList: List): Todo {
    let todo: Todo;
    todo = parentList.todos.find((td) => td.id === id);
    console.log(todo);
    return todo;
  }

  GetTodoObservable(list: List) {
    let todosCollection: AngularFirestoreCollection<Todo>;
    let todosObservable: Observable<Todo[]>;
    todosCollection = this.afs
      .collection<List>("lists")
      .doc(list.id)
      .collection("todos", (ref) => ref.orderBy("timestamp", "asc"));
    todosObservable = todosCollection.valueChanges();
    todosObservable.subscribe((todos) => {
      list.todos = todos;
      todos.forEach((todo) => {
        const todoInList = list.todos.find((x) => x.id === todo.id);
        if (todoInList === undefined) {
          list.todos.push(todo);
        } else {
          todoInList.isDone = todo.isDone;
          todoInList.name = todo.name;
          todoInList.description = todo.description;
        }
      });
    });
    return todosObservable;
  }

  async Create(listName: string) {
    const id = this.afs.createId();
    const email = this.user.email;
    const list: List = {
      id,
      name: listName,
      colour: this.GetRandomColour(),
      owner: email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      canRead : [],
      canWrite : []
    };
    this.listsCollection.doc(id).set(list);
    
  }

  CreateTodo(list: List, todoName: string, todoDesc: string, deadline?: firebase.firestore.Timestamp) {
    const id = this.afs.createId();
    let todo: Todo;
    if (deadline !== undefined) {
      todo = {
        id,
        name: todoName,
        description: todoDesc,
        isDone: false,
        deadline,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      todo = {
        id,
        name: todoName,
        description: todoDesc,
        isDone: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    }
    this.listsCollection.doc(list.id).collection<Todo>("todos").doc(id).set(todo);
  }

  Delete(list: List) {
    this.afs.collection("lists").doc(list.id).delete();
  }

  DeleteTodo(list: List, todo: Todo) {
    this.afs.collection("lists").doc(list.id).collection("todos").doc(todo.id).delete();
  }

  private GetRandomColour(): string {
    const colourArray = ["primary", "secondary", "tertiary", "success", "warning", "danger", "medium", "dark"];
    return colourArray[Math.floor(Math.random() * colourArray.length)];
  }
}
