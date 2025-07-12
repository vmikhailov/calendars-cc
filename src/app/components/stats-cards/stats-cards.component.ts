import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IStatsApiService, STATS_API_SERVICE } from "../../api-services/stats-api.interface";
import { Observable } from "rxjs";

interface Stat {
    title: string;
    value: string;
    icon: string;
    color: string;
    bgColor: string;
    textColor: string;
}

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './stats-cards.component.html'
})
export class StatsCardsComponent {
    constructor(@Inject(STATS_API_SERVICE) private api: IStatsApiService) {
    }

    stats: Stat[] = [];

    ngOnInit() {
        this.api.getStats().subscribe((data: Stat[]) => {
            this.stats = data;
        });
    }
}