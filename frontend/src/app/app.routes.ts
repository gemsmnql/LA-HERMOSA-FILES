import { Routes } from '@angular/router';
import { Shop } from './shop/shop';
import { Features } from './features/features';
import { Contact } from './contact/contact';
import { BlogsComponent } from './blogs/blogs';
import { Home } from './home/home';
import { BlogDetailComponent } from './blogs/blog-detail/blog-detail';
import { ShopDetail } from './shop/shop-detail/shop-detail';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'shop', component: Shop },
    { path: 'features', component: Features },
    { path: 'contact', component: Contact },
    { path: 'blogs', component: BlogsComponent },
    { path: 'blogs/:id', component: BlogDetailComponent },
    { path: 'shop/:id', component: ShopDetail },
    
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
