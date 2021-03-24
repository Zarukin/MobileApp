import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { Observable } from "rxjs";
import { CreateTodoComponent } from "src/app/modals/create-todo/create-todo.component";
import { ShareListComponent } from "src/app/modals/share-list/share-list.component";
import { List } from "src/app/models/list";
import { Todo } from "src/app/models/todo";
import { ListService } from "src/app/services/list.service";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { Capacitor, Plugins } from "@capacitor/core";

const { SpeechRecognition } = Plugins;
const { TextToSpeech } = Plugins;
@Component({
  selector: "app-list-details",
  templateUrl: "./list-details.page.html",
  styleUrls: ["./list-details.page.scss"],
})
export class ListDetailsPage implements OnInit {
  @Input() list: List;
  private todosCollection: AngularFirestoreCollection<Todo>;
  private todosObservable: Observable<Todo[]>;
  public user: firebase.User;
  public isDisabled: boolean;
  public test: string;
  isNative: boolean;

  constructor(
    public route: ActivatedRoute,
    public listServices: ListService,
    private auth: AngularFireAuth,
    public modalController: ModalController,
    private titleService: Title,
    private afs: AngularFirestore,
    public router: Router
  ) {}

  async ngOnInit() {
    this.isNative = Capacitor.isNative;
    const id = this.route.snapshot.paramMap.get("id");
    console.log(id);
    this.list = new List("", [], "");
    this.listServices.GetAll().subscribe(async () => { // Obligé de récupérer toutes les listes avant sinon GetOne renvoie une liste vide.
      this.list = this.listServices.GetOne(id);
      this.user = await this.auth.currentUser;
      this.todosCollection = this.afs
        .collection<List>("lists")
        .doc(this.list.id)
        .collection("todos", (ref) => ref.orderBy("timestamp", "asc"));
      this.todosObservable = this.todosCollection.valueChanges();
      this.todosObservable.subscribe((todos) => {
        this.list.todos.forEach(todo => {
          if (todos.find((x) => x.id === todo.id) === undefined ){
            this.list.todos.splice(this.list.todos.indexOf(todo),1)
          }
          }
        );
        todos.forEach((todo) => {
          const todoInList = this.list.todos.find((x) => x.id === todo.id);
          if (todoInList === undefined) {
            this.list.todos.push(todo);
          } else {
            todoInList.isDone = todo.isDone;
            todoInList.name = todo.name;
            todoInList.description = todo.description;
            todoInList.deadline  = todo.deadline;
            todoInList.timestamp  = todo.timestamp;
          }
        });
      });
      this.shouldDisable();
    });
    
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – " + this.list.name);
  }

  updateIsDone(todo: Todo) {
    if (this.user !== undefined && (this.list.owner === this.user.email || this.list.canWrite.indexOf(this.user.email) !== -1)) {
      this.afs.collection("lists").doc(this.list.id).collection("todos").doc(todo.id).update({ isDone: !todo.isDone });
    }
  }

  async presentModalTodo() {
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: {
        list: this.list,
      },
    });
    return await modal.present();
  }

  async presentModalShare() {
    const modal = await this.modalController.create({
      component: ShareListComponent,
      cssClass: "my-custom-class",
      componentProps: {
        list: this.list,
      },
    });
    return await modal.present();
  }

  deleteTodo(todo: Todo) {
    this.listServices.DeleteTodo(this.list, todo);
    this.list.todos.splice(this.list.todos.indexOf(todo,1));
  }

  share() {
    this.presentModalShare();
  }

  shouldDisable() {
    if (this.user !== undefined && this.list.owner !== this.user.email && this.list.canWrite.indexOf(this.user.email) === -1) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  async Speak(){
    SpeechRecognition.requestPermission().then();
      SpeechRecognition.start({
       partialResults: true,
       prompt: "Dites quelques chose",
       popup: true,
     }).then((result)=> { 
     this.Analyze(result.matches)  ;
     });
  }
 

  async Analyze( matches : String[]){
    var flagOperation = false
    matches.forEach( async Element => {
       if ((Element.includes("crée") || Element.includes("ajoute") ) && Element.includes("tâche") && Element.includes("nom ") && flagOperation === false){
         if (Element.split("nom ")[1] !== undefined){
          this.test = "nn : " + Element.split("nom ")[1];
          this.listServices.CreateTodo(this.list,Element.split("nom ")[1], " ");
          flagOperation = true;
         }
       }
       else if (Element.includes("lis") && Element.includes("mes") && Element.includes("tâche") && flagOperation === false){
         var allTitle = "Vos taches à faire on pour titre : "
         this.list.todos.forEach( element =>{
           allTitle += element.name + ". ";
         });
           const jean =  await TextToSpeech.speak({
             text: allTitle,
             locale: "fr-FR",
              speechRate: 1,
              pitchRate: 1,
           } );
         flagOperation = true;
       }else if ((Element.includes("affiche") || Element.includes("montre") ) && Element.includes("tâche") && Element.includes("nom ")  && flagOperation === false){
        var selectedTodo
        this.list.todos.forEach(todo => {
          if (selectedTodo === undefined && todo.name === Element.split("nom ")[1]){
            selectedTodo = todo
          }
        });
        if (selectedTodo !== undefined){
          await this.router.navigate(["todo-details/", selectedTodo.id],{
            queryParams: {
              list: this.list.id
            },
            queryParamsHandling: 'merge',
          });
        }
  }
    })
  }
}
