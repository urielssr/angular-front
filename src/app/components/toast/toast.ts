import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private nextId = 0;

  ngOnInit() {
    // Listen for toast events
    window.addEventListener('toast', (e: any) => {
      this.add(e.detail.message, e.detail.type);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('toast', any);
  }

  add(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.nextId;
    this.toasts = [...this.toasts, { id, message, type }];
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 3500);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'x-circle';
      default: return 'info';
    }
  }
}

const any = (e: any) => e;
