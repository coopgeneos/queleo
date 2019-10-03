import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    public afAuth: AngularFireAuth, 
    private router: Router) {}

  ngOnInit() {
    this.afAuth.user
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(() => {this.router.navigate(['/feeds']);})
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }
  
  logout() {
    this.afAuth.auth.signOut();
  }

  createAccount() {
    console.log("creating")
  }
  

}
