import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tech-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tech-info.component.html',
    styleUrls: ['./tech-info.component.css']
})
export class TechInfoComponent {
    nodeVersion = 'v22.17.0';
    npmVersion = '10.9.2';
    angularVersion = '19.2.14';
}
