import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const productRoutes: Routes = [
  { path: ':id', component: ProductDetailComponent },
];
