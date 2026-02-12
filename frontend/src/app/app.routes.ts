import { Routes } from '@angular/router';
import { Shop } from './shop/shop';
import { Features } from './features/features';
import { Contact } from './contact/contact';
import { BlogsComponent } from './blogs/blogs';
import { Home } from './home/home';
import { LoginComponent } from './admin/login/login';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { BlogDetailComponent } from './blogs/blog-detail/blog-detail';
import { ShopDetail } from './shop/shop-detail/shop-detail';
import { authGuard } from './admin/auth.guard';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'shop', component: Shop },
    { path: 'features', component: Features },
    { path: 'contact', component: Contact },
    { path: 'blogs', component: BlogsComponent },
    { path: 'blogs/:id', component: BlogDetailComponent },
    { path: 'shop/:id', component: ShopDetail },
    { path: 'admin/login', component: LoginComponent },
    
    { 
      path: 'admin/dashboard', 
      component: DashboardComponent, 
      canActivate: [authGuard] 
    }, 
    
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
