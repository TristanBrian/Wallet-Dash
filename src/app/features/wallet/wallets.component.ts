import { SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WalletService } from '../../core/services/wallet.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatusIndicatorComponent } from '../../shared/components/status-indicator/status-indicator.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Wallet } from '../../core/models/wallet.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [
    SlicePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    StatusIndicatorComponent,
    CurrencyFormatPipe,
  ],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.scss',
})
export class WalletsComponent {
  private readonly walletService = inject(WalletService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly wallets = toSignal(
    this.walletService.getWallets().pipe(catchError(() => of([] as Wallet[]))),
  );
  readonly columns = ['name', 'network', 'address', 'balance', 'usdValue', 'status', 'actions'];
  readonly editingId = signal<string | null>(null);

  copyAddress(address: string): void {
    navigator.clipboard.writeText(address);
    this.snackBar.open('Address copied to clipboard', 'Close', { duration: 3000 });
  }

  viewWallet(wallet: Wallet): void {
    this.snackBar.open(`Viewing ${wallet.name}`, 'Close', { duration: 2000 });
  }

  editWallet(wallet: Wallet): void {
    this.editingId.set(wallet.id);
    const updated = { ...wallet, name: wallet.name + ' (edited)' };
    this.walletService.updateWallet(updated);
    this.snackBar.open('Wallet updated', 'Close', { duration: 2000 });
    this.editingId.set(null);
  }

  deleteWallet(wallet: Wallet): void {
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Wallet',
        message: `Are you sure you want to delete "${wallet.name}"?`,
        confirmLabel: 'Delete',
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.walletService.deleteWallet(wallet.id);
        this.snackBar.open('Wallet deleted', 'Close', { duration: 3000 });
      }
    });
  }
}
