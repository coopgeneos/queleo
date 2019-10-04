import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  password2: string;

  constructor(
    public afAuth: AngularFireAuth, 
    private router: Router) {}

  ngOnInit() {
    if(this.afAuth.user) {
      this.router.navigate(["/feeds"]);
    }
  }

  createAccount() : void {
    if(this.password != this.password2) {return alert('Diferent passwords!')}
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {this.router.navigate(['/feeds']);})
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

}
