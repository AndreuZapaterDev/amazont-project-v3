import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OffersComponent } from './offers/offers.component';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GeneralComponent } from './general/general.component';
import { CategoriesComponent } from './categories/categories.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: GeneralComponent,
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        children: [
          { path: '', redirectTo: '1', pathMatch: 'full' }, // Default to first category
          {
            path: ':name',
            component: CategoryComponent,
          },
        ],
      },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'cart', component: ShoppingCartComponent },
      { path: 'checkout', component: PaymentProcessComponent },
      { path: 'payment-process', component: PaymentProcessComponent },
    ],
  },
  { path: 'offers', component: OffersComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', redirectTo: 'home/cart', pathMatch: 'full' },
];
