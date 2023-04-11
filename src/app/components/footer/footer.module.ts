import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';


// Angular Material
import { MatButtonModule } from 'src/app/app.material/button';
import { MatIconModule } from 'src/app/app.material/icon';
import { MatToolbarModule } from 'src/app/app.material/toolbar';

@NgModule({
    declarations: [
        FooterComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        FooterComponent
    ]
})
export class FooterModule { }
