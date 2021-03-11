import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CreateListComponent } from "./modals/create-list/create-list.component";
import { CreateTodoComponent } from "./modals/create-todo/create-todo.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAnalyticsModule } from "@angular/fire/analytics";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
import { CreateAccountComponent } from "./modals/create-account/create-account.component";
import { ChangeEmailComponent } from "./modals/change-email/change-email.component";
import { ChangePasswordComponent } from "./modals/change-password/change-password.component";
import { ShareListComponent } from "./modals/share-list/share-list.component";
import { ListSettingsComponent } from "./modals/list-settings/list-settings.component";


@NgModule({
  declarations: [
    AppComponent,
    CreateListComponent,
    CreateTodoComponent,
    CreateAccountComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ShareListComponent,
    ListSettingsComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
