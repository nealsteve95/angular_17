import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { error } from 'console';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [RouterLink,
    ReactiveFormsModule,
    CommonModule,
    
    
    ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent implements OnInit{
    productoForm : FormGroup;
    titulo = 'Crear Producto';
    id: String | null
  // El formulario es productoForm
    constructor(private fb:FormBuilder,
                private router: Router,
                private toastr: ToastrService,
                private productoService: ProductoService,
                private aRouter: ActivatedRoute
                ){
      this.productoForm = this.fb.group({
        producto: ['',Validators.required],
        categoria: ['',Validators.required],
        ubicacion: ['',Validators.required],
        precio: ['',Validators.required],
      })
      // La manera de ingresar al id 
      this.id = this.aRouter.snapshot.paramMap.get('id')
    }
    ngOnInit(): void {
        this.esEditar();
    }

    agregarProducto(){
      // Producto es una clase que forma parte del  modelo de datos que se encuentra en los models
      const PRODUCTO: Producto = {
        nombre: this.productoForm.get('producto')?.value,
        categoria: this.productoForm.get('categoria')?.value,
        ubicacion: this.productoForm.get('ubicacion')?.value,
        precio: this.productoForm.get('precio')?.value,
      }

      if(this.id !== null){
        // Editamos producto
        this.productoService.editarProducto(this.id,PRODUCTO).subscribe(data =>{
          this.toastr.success("El producto fue actualizado con exito","Producto actualizado")
          this.router.navigate(['/'])
        },error =>{
          console.log(error);
          this.productoForm.reset();
        })


      } else{
        // Agregamos producto
        console.log(PRODUCTO)
        this.productoService.guardarProducto(PRODUCTO).subscribe(data =>{
        this.toastr.info('Producto guardado exitosamente', 'Buen Trabajo!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.productoForm.reset();
      })
      }

      
      
    }

    esEditar (){
      if(this.id != null){
        this.titulo = "Editar Producto";
        this.productoService.obtenerProducto(this.id).subscribe(data =>{
          this.productoForm.setValue({
            producto: data.nombre,
            categoria: data.categoria,
            ubicacion: data.ubicacion,
            precio: data.precio,
          })
        })
    }
    
}
}