import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductResponse } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 0;
  pageSize = 9;
  totalElements = 0;
  totalPages = 0;
  
  // Search
  searchQuery = '';
  isSearching = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(page: number = 0) {
    this.loading = true;
    this.error = null;
    
    if (this.isSearching && this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (data) => {
          this.products = data;
          this.totalElements = data.length;
          this.totalPages = 1;
          this.currentPage = 0;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al buscar productos: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.productService.getProducts(page, this.pageSize).subscribe({
        next: (data: ProductResponse) => {
          this.products = data._embedded.products;
          this.totalElements = data.page.totalElements;
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar productos: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  onSearch() {
    this.isSearching = true;
    this.loadProducts(0);
  }

  onClearSearch() {
    this.searchQuery = '';
    this.isSearching = false;
    this.loadProducts(0);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.showToast('Producto eliminado correctamente', 'success');
          // Reload to update pagination if needed
          const remainingPages = Math.ceil((this.totalElements - 1) / this.pageSize);
          if (this.currentPage >= remainingPages && this.currentPage > 0) {
            this.loadProducts(this.currentPage - 1);
          }
        },
        error: (err) => {
          this.showToast('Error al eliminar: ' + err.message, 'error');
        }
      });
    }
  }

  onPageChange(page: number) {
    this.isSearching = false;
    this.loadProducts(page);
  }

  get formatPrice(): (price: number) => string {
    return (price: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(price);
    };
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { message, type }
    }));
  }
}
