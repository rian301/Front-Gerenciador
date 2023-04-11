import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InputValidatorComponent } from './input-validator.component';

// Angular Material
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatToolbarModule } from 'src/app/app.material';

@NgModule({
    declarations: [
        InputValidatorComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule
    ],
    exports: [
        InputValidatorComponent
    ]
})
export class InputValidatorModule { }
