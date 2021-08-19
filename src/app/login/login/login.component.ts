import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';

import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isLoginError = false;
  btnLoginText =$localize `Login`
  loginErrorMessage =$localize `Id unknown or password incorrect`
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
   
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (localStorage.getItem('token')!== undefined) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
   
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.isLoginError = true;
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
            
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.isLoginError = true;
          this.error = error;
          this.loading = false;
        },
      });
  }

  // loginForm: FormGroup;

  // loading = false;

  // constructor(
  //     private router: Router,
  //     private fb: FormBuilder,
  //     private authService: AuthService,
  // ) {
  //   this.createLoginForm()
  // }

  // ngOnInit() {}
  // onLogin() {
  //   console.log("lofdsdasdsad")
  //   const controls = this.loginForm.controls;
  // 	// if (this.loginForm.invalid) {
  // 	// 	Object.keys(controls).forEach(controlName =>
  // 	// 		controls[controlName].markAsTouched()
  // 	// 	);
  // 	// 	return;
  // 	// }
  //   let	email = controls['email'].value;
  //   let	password= controls['password'].value;
  //   this.authService.login(email, password);
  // }

  // createLoginForm(){
  //   this.loginForm = this.fb.group({
  // 		email: ['', Validators.compose([
  // 			Validators.required,
  // 			Validators.email,
  // 		])],
  // 		password: ['', Validators.compose([
  // 			Validators.required,
  // 		])]
  // 	});
  // }
}
