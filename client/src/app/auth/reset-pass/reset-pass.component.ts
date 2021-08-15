import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

nombreUs = '';
matcher = new ErrorStateMatcher();
messageSnack:string;
resetForm:FormGroup;
userNames=[];
durationInSeconds=3;
selectedUser="";

constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      'nombreUs' : [null, Validators.required],
      'pass' : [null, Validators.required],
      'ConfirmPass' : [null,Validators.required]
    },{validator: this.passwordConfirming});

    this.getUserNames();
  }

  getUserNames(){
    this.authService.getUsers().subscribe((users)=>{
      this.userNames = users;
    })
  }

  userChange(event){
    console.log(event);
    this.resetForm.get('nombreUs').setValue(event.value)
  }

  onFormSubmit(form: NgForm){
      this.authService.changePass(form)
      .subscribe(res=>{
        console.log(res)
      })
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('ConfirmPass').value!==null && (c.get('pass').value !== c.get('ConfirmPass').value)) {
        return {invalid: true};
    }
  }
  
}


  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  
  }
  