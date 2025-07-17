import { Component } from '@angular/core';
import { versionInfo } from '../../../version-info';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tech-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tech-info.component.html',
    styleUrls: ['./tech-info.component.css']
})
export class TechInfoComponent {
    nodeVersion: string = versionInfo.node;
    npmVersion: string = versionInfo.npm;
    angularVersion: string = versionInfo.angular;
    deployedAt: string = versionInfo.deployedAt;
}
