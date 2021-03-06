import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { createAnimation, MenuController, ModalController } from "@ionic/angular";
import { Observable, Subscription } from "rxjs";
import { CreateListComponent } from "../modals/create-list/create-list.component";
import { List } from "../models/list";
import { ListService } from "../services/list.service";
import { LoadingService } from "../services/loading.service";
import { RoutingService } from "../services/routing.service";
import { ToastService } from "../services/toast.service";
import firebase from "firebase/app";
import { ListSettingsComponent } from "../modals/list-settings/list-settings.component";

import { Capacitor, Plugins } from "@capacitor/core";
import { Todo } from "../models/todo";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { element } from "protractor";
import { mainModule } from "process";
const { Storage } = Plugins;
const { SpeechRecognition } = Plugins;
const { TextToSpeech } = Plugins;
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  @Input() lists: List[];
  listsBackup: List[];
  darkMode = false;
  verifiedEmail: boolean;
  currentUser: firebase.User;
  userSub: Subscription;
  listSub: Subscription;
  listsObservable: Observable<List[]>;
  isNative: boolean;
  public dis : String 
  constructor(
    public listService: ListService,
    public router: Router,
    private titleService: Title,
    private auth: AngularFireAuth,
    public modalController: ModalController,
    private menuController: MenuController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private routeService: RoutingService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.lists = [];
    this.isNative = Capacitor.isNative;
    this.getDarkMode().then(() => {
      console.log("darkMode : " + this.darkMode);
      if (this.darkMode === true) {
        document.body.setAttribute("color-theme", "dark");
      } else {
        document.body.setAttribute("color-theme", "light");
      }
    });
    this.routeService.subscribeRoute();
    this.userSub = this.auth.user.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.verifiedEmail = user.emailVerified;
        console.log("Is the email verified ? " + this.verifiedEmail);
      }
    });
    
this.ResetListObservable();
 

    // if (document.body.getAttribute("color-theme") === "light") {
    //   this.darkMode = false;
    // } else if (document.body.getAttribute("color-theme") === "dark") {
    //   this.darkMode = true;
    // }
  }

  ResetListObservable(){
    this.listsObservable = this.listService.GetAll();
    this.listSub = this.listsObservable.subscribe(async (lists) => {
      const user = this.currentUser;
      lists.forEach((element) => {
        if (element.todos === undefined) {
          element.todos = [];
        }
        if (element.canRead === undefined) {
          element.canRead = [];
        }
        if (element.canWrite === undefined) {
          element.canWrite = [];
        }
        this.listService.GetTodoObservable(element).subscribe((todos) => {
          element.todos = todos;
        });
      });
      this.lists.forEach(list => {
        if (lists.find((x) => x.id === list.id) === undefined ){
          this.lists.splice(this.lists.indexOf(list),1)
        }
        }
      );
      lists.forEach(list => {
        const listInLists = this.lists.find((x) => x.id === list.id);
          if (listInLists === undefined) {
            this.lists.push(list);
          } else {
            listInLists.name = list.name;
            listInLists.timestamp = list.timestamp;
            listInLists.canRead = list.canWrite;
            listInLists.colour = list.colour;
            listInLists.canWrite = list.canWrite;
            listInLists.todos = list.todos;
          }
        }
      );

  
      this.listsBackup = [...this.lists];
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.listSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.titleService.setTitle("Todos – Mes listes");
  }

  public async presentModalList() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      swipeToClose: true,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      this.listsObservable = this.listService.GetAll();
    });
    return await modal.present();
  }

  public async presentModalListSetting(list: List) {
    const modal = await this.modalController.create({
      component: ListSettingsComponent,
      componentProps: {
        list,
      },
      swipeToClose: true,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      this.listsObservable = this.listService.GetAll();
    });
    return await modal.present();
  }

  public deleteList(list: List) {
    if (list.owner == this.currentUser.email){
    this.listService.Delete(list);
    }else if (list.canWrite.indexOf(this.currentUser.email) > -1) {
 list.canWrite.splice(list.canWrite.indexOf(this.currentUser.email),1)
      this.afs.collection("lists").doc(list.id).update({ canWrite: list.canWrite });
    }else if (list.canRead.indexOf(this.currentUser.email) > -1 ){
      list.canRead.splice(list.canRead.indexOf(this.currentUser.email));
      this.afs.collection("lists").doc(list.id).update({ canRead:  list.canRead});
    }
    this.lists.splice(this.lists.indexOf(list),1);
  }

  public toggleColourTheme() {
    if (this.darkMode === true) {
      document.body.setAttribute("color-theme", "dark");
      this.setDarkMode("true");
    } else {
      document.body.setAttribute("color-theme", "light");
      this.setDarkMode("false");
    }
  }

  public async logout() {
    this.menuController.close();
    await this.loadingService.presentLoading("Déconnexion…");
    await this.auth.signOut();
    await this.router.navigate(["/", "login"]);
    if (!this.verifiedEmail) {
      await this.toastService.dismissToast();
    }
    this.loadingService.dismissLoading();
  
  }

  doRefresh(event) {
    window.location.reload();
  }

  async hideSearch() {
    const animIn = createAnimation()
      .addElement(document.getElementById("searchBar"))
      .duration(50)
      .beforeAddWrite(() => { document.getElementById("searchBar").hidden = false; })
      .fromTo("transform", "translateY(-40px)", "translateY(0px)")
      .fromTo("opacity", "0", "1");
    const animOut = createAnimation()
      .addElement(document.getElementById("searchBar"))
      .duration(50)
      .afterAddWrite(() => {
        document.getElementById("searchBar").hidden = true;
      })
      .fromTo("transform", "translateY(0px)", "translateY(-40px)")
      .fromTo("opacity", "1", "0");
    const animListIn = createAnimation()
      .addElement(document.getElementById("listOfList"))
      .duration(50)
      .fromTo("transform", "translateY(0px)", "translateY(58px)");
    const animListOut = createAnimation()
      .addElement(document.getElementById("listOfList"))
      .duration(50)
      .fromTo("transform", "translateY(58px)", "translateY(0px)");

    const animationIn = createAnimation().addAnimation([animIn, animListIn]);
    const animationOut = createAnimation().addAnimation([animOut, animListOut]);

    console.log(document.querySelector("ion-list"));
    if (document.getElementById("searchBar").hidden === true) {
      document.getElementById("searchIcon").setAttribute("name", "close-outline");
      animationIn.play();
    } else if (document.getElementById("searchBar").hidden === false) {
      document.getElementById("searchBar").setAttribute("value", "");
      this.lists = this.listsBackup;
      document.getElementById("searchIcon").setAttribute("name", "search-outline");
      await animationOut.play();
    }
  }

  search(e) {
    this.lists = this.listsBackup;
    const searchTerm: string = e.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.lists = this.lists.filter((list) => {
      return (
        list.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        list.owner.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
        list.todos.find((todo) => todo.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) !== undefined
      );
    });
    console.log(this.lists);
  }

  async setDarkMode(bool: string) {
    await Storage.set({
      key: "darkMode",
      value: bool,
    });
  }

  async getDarkMode() {
    const { value } = await Storage.get({ key: "darkMode" });
    this.darkMode = value === "true" ? true : false;
    console.log("Got darkMode: ", value);
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
        if ((Element.includes("crée") || Element.includes("ajoute") ) && Element.includes("liste") && Element.includes("nom")  && flagOperation === false){
          if (Element.split("nom ")[1] != undefined){
          this.listService.Create(Element.split("nom ")[1]);
          flagOperation = true;
          }
        }
        else if (Element.includes("lis") && Element.includes("mes") && Element.includes("liste") && flagOperation === false){
          var allTitle = "Vos listes on pour titre : "
          this.lists.forEach( element =>{
            allTitle += element.name + ", ";
          });

            const jean =  await TextToSpeech.speak({
              text: allTitle,
              locale: "fr-FR",
               speechRate: 1,
               pitchRate: 1,
            } );
          flagOperation = true;
        }else if ((Element.includes("affiche") || Element.includes("montre") ) && Element.includes("liste") && Element.includes("nom")  && flagOperation === false){
              var selectedList 
              this.lists.forEach(list => {
                if (selectedList === undefined && list.name === Element.split("nom ")[1]){
                  selectedList = list
                }
              });
              if (selectedList){
                await this.router.navigate(["/list-details/", selectedList.id]);
              }
        }
     })
   }
}
