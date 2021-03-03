import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { List } from "../models/list";
import { Todo } from "../models/todo";

@Injectable({
  providedIn: "root",
})
export class ListService {
  private lists: List[];
  private listsCollection: AngularFirestoreCollection<List>;
  listsObservable: Observable<List[]>;

  constructor(private afs: AngularFirestore) {
    this.lists = [];
    /*const list1 = new List("Divers", [
      new Todo(
        "Faire les courses",
        "- Fourme de Montbrison\n- Papier toilette\n- Morbier\n- Bulots",
        false
      ),
      new Todo("Aller chercher les enfants à l'école", "À 16h30", true),
    ]);
    list1.colour = "primary";
    const list2 = new List("Moutons", [
      new Todo(
        "Tondre les moutons",
        "Ça fait 5 mois que Pedro n'a pas été tondu je pense qu'il est temps maintenant de récupérer sa laine. Je ferai aussi Isabelle au passage si j'ai le temps mais c'est pas sûr. Il me faudrait également de la laine noire donc la tonte de Dimitri est impérative.",
        false
      ),
      new Todo("Vendre la laine au marché", "", false),
    ]);
    list2.colour = "danger";
    const list3 = new List("Codes", [
      new Todo("WiFi", "12345678910", false),
      new Todo("Coffre", "abcd", true),
      new Todo("Missiles nucléaires", "0000", true),
      new Todo("Porte", "9876AB", true),
      new Todo("Twitter", "ILoveMacron02", false),
      new Todo("Banque", "MagnoliaForever", false),
      new Todo("Ordinateur mezzanine", "ASSE<3", true),
      new Todo("Portefeuille Bitcoin", "RPZ_Saint-Étienne42", true),
      new Todo("Discord", "cpt.thomas!Sankara", false),
      new Todo("Facebook", "facedebouc96", false),
      new Todo("Bâtiment D", "45581236848413158685315656156", false),
      new Todo("Dossier chiffré", "jean-luc_reichmann.je^t'aime", false),
      new Todo("GitLab", "prolétairesdetouslespaysunissezvous!", false),
      new Todo("Reddit", "j'aiplusd'inspi", false),
    ]);
    list3.colour = "warning";
    this.lists.push(list1, list2, list3);*/
    this.listsCollection = this.afs.collection<List>("lists");
    this.listsObservable = this.listsCollection.valueChanges();
    this.listsObservable.subscribe((lists) => {
      this.lists = lists;
    });
  }

  GetAll() {
    return this.listsObservable;
  }

  GetOne(id: string) {
    return this.lists.find((list) => list.id === id);
  }

  GetTodo(id: string) {
    const currentList = this.lists.find((list) =>
      list.todos.find((todo) => todo.id === id)
    );
    return {
      todo: currentList.todos.find((todo) => todo.id === id),
      currentList,
    };
  }

  Create(listName: string) {
    // list.colour = this.GetRandomColour();
    // this.lists.push(list);
    const id = this.afs.createId();
    const list: List = { id, name: listName, colour: this.GetRandomColour()};
    this.listsCollection.doc(id).set(list);
    //this.listsCollection.doc(id).collection<Todo>("todos").add(new Todo("temp","yolo",true))
  }

  CreateTodo(list: List, todoName: string, todoDesc: string) {
    const id = this.afs.createId();
    const todo: Todo = { id, name: todoName, description: todoDesc, isDone: false };
    this.listsCollection.doc(list.id).collection<Todo>("todos").doc(id).set(todo);
  }

  Delete(list: List) {
    // this.lists.splice(this.lists.indexOf(list), 1);
    this.afs.collection("lists").doc(list.id).delete();
  }

  DeleteTodo(list: List, todo: Todo) {
    this.afs.collection("lists").doc(list.id).collection("todos").doc(todo.id).delete();
  }

  private GetRandomColour(): string {
    const colourArray = [
      "primary",
      "secondary",
      "tertiary",
      "success",
      "warning",
      "danger",
      "medium",
      "dark",
    ];
    return colourArray[Math.floor(Math.random() * colourArray.length)];
  }
}
