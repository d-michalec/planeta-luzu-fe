import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  NgZone,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { BrowserQRCodeReader } from '@zxing/browser';
import { AssignHeadphonesApiService } from '../service/assign-headphones.api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-headphones',
  templateUrl: './assign-headphones.html',
  styleUrl: './assign-headphones.css',
  imports: [FormsModule, CommonModule]
})
export class AssignHeadphones implements AfterViewInit, OnDestroy {

  private api = inject(AssignHeadphonesApiService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('video', { static: true })
  videoRef!: ElementRef<HTMLVideoElement>;

  scanner = new BrowserQRCodeReader();
  controls: any = null;

  scannedTicket: string | null = null;
  headphonesId: number | null = null;

  isActive = false;
  error: string | null = null;

  scannerStopped = false;

  private started = false;

  // ---------------- LIFECYCLE ----------------
  ngAfterViewInit() {

    // 🔥 FIX 1: DOM stabilizacja
    setTimeout(() => {

      requestAnimationFrame(() => {

        this.startScanner();

      });

    }, 150);
  }

  ngOnDestroy() {
    this.stopScanner();
  }

  // ---------------- START ----------------
  async startScanner() {
    this.scannedTicket = 'c4d284c9-7e9f-485e-84c5-ed8e635a4a1d';
    this.isActive = false;
    this.scannerStopped = true;
    this.cdr.detectChanges();
    return;
    this.scannedTicket = "";
    if (this.started) return;


    this.started = true;

    this.error = null;

    // 🔥 FIX 2: UI sync BEFORE camera
    this.zone.run(() => {
      this.isActive = true;
      this.cdr.detectChanges();
    });

    try {

      await new Promise(res => setTimeout(res, 200));

      if (!this.videoRef?.nativeElement) {
        throw new Error('Video element not ready');
      }

      this.controls = await this.scanner.decodeFromVideoDevice(
        undefined,
        this.videoRef.nativeElement,
        (result, err) => {

          if (result) {

            this.zone.run(() => {
              this.scannedTicket = result.getText();

              console.log('🟢 QR:', this.scannedTicket);

              setTimeout(() => {
                this.stopScanner();
              }, 150);

              this.cdr.detectChanges();
            });
          }

          if (err && err.name !== 'NotFoundException') {
            console.warn('scan err:', err);
          }
        }
      );

      console.log('📷 CAMERA STARTED');

    } catch (e: any) {

      console.error(e);

      this.zone.run(() => {
        this.error = e?.message || 'Camera error';
        this.isActive = false;
        this.cdr.detectChanges();
      });
    }
  }

  // ---------------- STOP ----------------
  stopScanner() {

    this.scannerStopped = true

    this.isActive = false;

    if (this.controls) {
      this.controls.stop?.();
      this.controls = null;
    }

    this.started = false;
  }

  // ---------------- RESTART (SAFE) ----------------
  restartScanner() {

    this.stopScanner();

    setTimeout(() => {

      requestAnimationFrame(() => {

        this.startScanner();

      });

    }, 300);
  }

  // ---------------- ACTION ----------------
  assign() {

    if (!this.scannedTicket || !this.headphonesId) return;

    this.api.assignHeadphones(this.scannedTicket, this.headphonesId)
      .subscribe({
        next: () => {
          alert('Assigned');
          this.reset();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Assign failed';
        }
      });
  }

  reset() {
    this.scannedTicket = null;
    this.headphonesId = null;
    this.restartScanner();
  }
}
