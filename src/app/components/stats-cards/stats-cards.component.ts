import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IStatsApiService, Stat, STATS_API_SERVICE } from "../../api-services/stats/interface";
import { AutoRefreshComponent } from "../../framework/auto-refresh.component";

@Component({
    selector: 'app-stats-cards',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './stats-cards.component.html'
})
export class StatsCardsComponent extends AutoRefreshComponent implements OnInit {
    stats: Stat[] = [];

    constructor(@Inject(STATS_API_SERVICE) private api: IStatsApiService) { super(); }

    ngOnInit() {
        this.startAutoRefresh(() => this.api.getStats().subscribe(data => this.stats = data), 5000);
    }
}