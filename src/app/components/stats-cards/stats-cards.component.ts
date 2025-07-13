import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IStatsApiService, Stat, STATS_API_SERVICE } from "../../api-services/stats/interface";

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './stats-cards.component.html'
})
export class StatsCardsComponent implements OnInit {
    constructor(@Inject(STATS_API_SERVICE) private api: IStatsApiService) {
    }

    stats: Stat[] = [];

    ngOnInit() {
        this.api.getStats().subscribe((data: Stat[]) => {
            this.stats = data;
        });
    }
}