import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { MensajesService } from '../services/mensajes.service';  // Nuestro proveedor de mensajes
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  // data: Cliente[] = [];
  data:MatTableDataSource<any>;
  displayedColumns: string[] = ['accion','legajoCli', 'nombreCli'];
  isLoadingResults = true;
  idCliente:number;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private clienteService: ClienteService, private authService:AuthService, private router:Router,public dialog:MatDialog,private route:ActivatedRoute,private mensajesService: MensajesService) { }

  ngOnInit() {
    this.data=new MatTableDataSource();
    this.data.sort = this.sort;
    this.getClientes();
    this.data.filterPredicate = function(data, filter: string): boolean {
      
      return (String(data.legajoCli).toLowerCase().includes(filter) || data.nombreCli.toLowerCase().includes(filter));
    };
  }

  getClientes(): void {
    this.clienteService.getClientes()
      .subscribe(res => {
        this.data.data = res.data;
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  getCliente(id: number) {
    this.clienteService.getCliente(id).subscribe(data => {
      this.idCliente = data.idCliente;
    });
  }

  dialogAddCli(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    // dialogConfig.width= '300px';
    //this.dialog.open(CourseDialog3Component, dialogConfig);
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.onFormSubmit(data, this.dialog);
        
      } else {
        this.dialog.closeAll();
        this.getClientes();
      }
    });
  }

  dialogEditCli(obj): void {
    obj.titulo="Editar cliente";
    obj.labelButton="Guardar"
    this.getCliente(obj.idCliente);
    console.log(obj);
    this.dialog.open(CourseDialog3Component, { data:obj});
    const dialogRef2 = this.dialog.open(CourseDialog3Component, { data:obj});
    dialogRef2.afterClosed().subscribe(res=>{
      if(res)
      {
        this.onUpdateSubmit(res);
      }
      this.dialog.closeAll();
    })
  }

  dialogDeleteCli(cli){
    cli.titulo="Borrar Cliente";
    cli.labelButton="Borrar";
    this.getCliente(cli.idCliente);
    this.dialog.open(CourseDialog3Component, { data:cli});
    const dialogRef2 = this.dialog.open(CourseDialog3Component, { data:cli});
    dialogRef2.afterClosed().subscribe(res=>{
      if(res)
      {
        this.onDelete(res);
      }
      this.dialog.closeAll();
    })

  }

  onDelete(form) {
    console.log(form)
    this.isLoadingResults = true;
    this.clienteService.deleteCliente(form.idCliente).subscribe(
      res => {
        if(res!==undefined)
        {
          this.getClientes();
        }
        this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      },
      ()=>{
      }
    );
    
  }

  onUpdateSubmit(form) {
    console.log(form)
    this.isLoadingResults = true;
    this.clienteService.updateCliente(form.idCliente, form).subscribe(
      res => {
        if(res!==undefined)
        {
          this.getClientes();
        }
        this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      },
      ()=>{
      }
    );
    
  }

  onFormSubmit(form: NgForm, dialog: MatDialog){
    this.isLoadingResults = true;
    this.clienteService.addCliente(form).subscribe(
      (res) => {
        if(res!==undefined)
        {
          this.getClientes();
        }
        this.isLoadingResults = false;
        dialog.closeAll();
        
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
        
    this.data.filter = filterValue.trim().toLowerCase();
    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

}

@Component({
  selector: "add-cliente",
  templateUrl: "add-cliente.html"
})

export class CourseDialog3Component{

  form: FormGroup;
  idCliente:number;
  nombreCli:string;
  legajoCli:number;
  titulo:string;
  labelButton:string;
  dataClientes=null;
  lastCli=0;
  matcher = new MyErrorStateMatcher();
  
  constructor(
    private clienteService:ClienteService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialog3Component>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
      this.titulo=data.titulo;
      this.labelButton=data.labelButton;
      this.idCliente=data.idCliente;
      this.nombreCli=data.nombreCli;
      this.legajoCli=data.legajoCli;

      
    }
    
    ngOnInit() {
      this.getClientes();
      this.form = this.fb.group({
        idCliente:[this.idCliente],
        nombreCli:[this.nombreCli,[Validators.required]],
        legajoCli:[this.legajoCli]
      });
      if(this.labelButton=='Borrar'){
        this.form.disable()
      }
  }

  getClientes(){
    this.clienteService.getClientes().subscribe(res => {
      this.dataClientes = res.data;
      this.lastCli=Math.max.apply(Math,this.dataClientes.map((l)=>{return l.legajoCli}));
      
    }, err => {
      console.log(err);
      
    });
  }

  save() {
    if(this.titulo==='Agregar Cliente'){
      this.form.controls['idCliente'].setValue(this.form.controls['legajoCli'].value);
    }

    
    this.dialogRef.close(this.form.value);
  }

  
  

  close() {
    this.dialogRef.close();
  }
}



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
