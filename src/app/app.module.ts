// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// Components
import { AppComponent } from './app.component';
import { FeedCardComponent } from './components/feed-card/feed-card.component';
import { FeedListComponent } from './components/feed-list/feed-list.component';
import { QuerytestComponent } from './components/querytest/querytest.component';
import { FeedFilterComponent } from './components/feed-filter/feed-filter.component'
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

// Services
import { FeedService } from './services/feed.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoryFirestoreService } from 'src/app/services/category-firestore.service'

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TranslatorPipe } from './pipes/translator.pipe';

import { environment } from '../environments/environment';
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { CommunityComponent } from './components/community/community.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedCardComponent,
    FeedListComponent,
    QuerytestComponent, 
    FeedFilterComponent, 
    SigninComponent, 
    SignupComponent, 
 
    CapitalizePipe,
    TranslatorPipe,
    CommunityCardComponent,
    CommunityListComponent,
    CommunityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'noticion'),
    AngularFireDatabaseModule
  ],
  providers: [
    FeedService, 
    AngularFireAuth, 
    AngularFireAuthGuard, 
    NgxXml2jsonService,
    AngularFirestore,
    CategoryFirestoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
