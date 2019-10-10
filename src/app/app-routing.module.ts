import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hasCustomClaim, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';

import { FeedListComponent } from './components/feed-list/feed-list.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { CommunityComponent } from './components/community/community.component';

const adminOnly = hasCustomClaim('admin');
const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['signin']);

const routes: Routes = [
  { path: '', redirectTo: '/feeds', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'feeds', component: FeedListComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'communities', component: CommunityListComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'community/:id', component: CommunityComponent, ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
