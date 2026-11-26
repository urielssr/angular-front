import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  product: Partial<Product> = {
    name: '',
    description: '',
    price: 0
  };
  
  isLoading = false;
  error: string | null = null;
  isEdit = false;
  productId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.product.name?.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }
    if (this.product.price === undefined || this.product.price === null || this.product.price < 0) {
      this.error = 'El precio debe ser un valor positivo';
      return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, this.product).subscribe({
        next: () => {
          this.showToast('Producto actualizado correctamente', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Error al actualizar: ' + err.message;
          this.isLoading = false;
        }
      });
    } else {
      this.productService.createProduct(this.product as Omit<Product, 'id'>).subscribe({
        next: () => {
          this.showToast('Producto creado correctamente', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Error al crear: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  private showToast(message: string, type: 'success' | 'error' | 'info') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { message, type }
    }));
  }
}
