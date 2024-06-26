import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SectoresService} from '../../services/sectores.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { Sectores } from 'src/app/models/sectores';

// interface IsOp {
//   value: boolean;
//   viewValue: string;
// }

interface TipoUs {
  value: number;
  viewValue: string;
}

interface ComboSectores{
  id:number;
  value:string;
  viewValue:string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  nombreUs = '';
  pass = '';
  nombreEmpleado='';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  selectedValue: number;
  valorSector:number;
  // isOp: IsOp[] = [
  //   {value: false, viewValue: 'Administrador'},
  //   {value: true, viewValue: 'Planta'},
  // ];

  idTipoUs: TipoUs[] = [
    {value: 1, viewValue: 'Admin'},
    {value: 2, viewValue: 'Operario'},
    {value: 3, viewValue: 'Encargado'},
    {value: 4, viewValue: 'Vista'},
    {value: 5, viewValue: 'Cobranza'},
  ];


  dataSectores:Sectores[]=[];
  grupoAp: FormGroup;
  comboSectores:ComboSectores[]=[];
  
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,private sectoresService:SectoresService) { }
  
  ngOnInit() {
    this.getSectores();
    this.registerForm = this.formBuilder.group({
      'nombreUs' : [null, Validators.required],
      'pass' : [null, Validators.required],
      // isOp:new FormControl(),
      idTipoUs:new FormControl(),
      idSector:new FormControl()
    });
    
    
    
  }

  

  getSectores():void{
    this.sectoresService.getSectores()
    .subscribe(sectores => {
      this.dataSectores=sectores;
      console.log(this.dataSectores);
      this.comboSectores =(<Sectores[]>sectores).map(v => {
        return {id:v.idSector,value:v.nombreSector,viewValue:v.nombreSector}
      })
      
    });
  }

  onFormSubmit(form: any) {
    console.log(form.idTipoUs);
    if(form.idTipoUs==1 || form.idTipoUs==4 || form.idTipoUs==5)
    {
      form.idSector=10;
    }
    this.authService.register(form)
      .subscribe(res => {
        console.log(res);
      }, (err) => {
        console.log(err);
        //alert(err.error);
      });
  }

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}