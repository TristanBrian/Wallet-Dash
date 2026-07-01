import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { AssetService } from '../../core/services/asset.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SparklineChartComponent } from '../../shared/components/sparkline-chart/sparkline-chart.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { PercentChangePipe } from '../../shared/pipes/percent-change.pipe';
import { catchError, of } from 'rxjs';
import { Asset } from '../../core/models/asset.model';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    MatCardModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    SparklineChartComponent,
    CurrencyFormatPipe,
    PercentChangePipe,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent {
  private readonly assetService = inject(AssetService);

  readonly assets = toSignal(
    this.assetService.getAssets().pipe(catchError(() => of([] as Asset[]))),
  );
}
