// auto-refresh.component.ts
import { Directive, OnDestroy } from '@angular/core';

@Directive()
export abstract class AutoRefreshComponent implements OnDestroy {
    private destroy = false;

    protected startAutoRefresh(fn: () => void, intervalMs: number) {
        const poll = () => {
            if (this.destroy) return;
            fn();
            if (!this.destroy) {
                setTimeout(poll, intervalMs);
            }
        };
        poll();
    }

    stopAutoRefresh() {
        this.destroy = true;
    }

    ngOnDestroy() {
        this.stopAutoRefresh();
    }
}