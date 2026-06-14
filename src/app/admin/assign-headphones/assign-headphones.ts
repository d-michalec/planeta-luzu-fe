import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';

import { BrowserQRCodeReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { AssignHeadphonesApiService } from '../service/assign-headphones.api.service';
import { resolveApiErrorMessage } from '../../shared/services/api/api-error.util';

type AssignMode = 'camera' | 'manual';

@Component({
  selector: 'app-assign-headphones',
  templateUrl: './assign-headphones.html',
  styleUrl: './assign-headphones.css',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ]
})
export class AssignHeadphones implements AfterViewInit, OnDestroy {

  private api = inject(AssignHeadphonesApiService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private messages = inject(MessageService);

  @ViewChild('video')
  videoRef?: ElementRef<HTMLVideoElement>;

  scanner = new BrowserQRCodeReader();
  controls: any = null;

  mode: AssignMode = 'camera';

  scannedTicket: string | null = null;
  headphonesId: number | null = null;

  manualEmail = '';
  manualHeadphonesId: number | null = null;

  isActive = false;
  isAssigning = false;
  isStartingCamera = false;
  cameraNeedsInteraction = true;
  scannerStopped = true;

  error: string | null = null;
  success: string | null = null;

  private started = false;

  ngAfterViewInit() {
    this.scheduleScannerStart();
  }

  ngOnDestroy() {
    this.stopScanner();
  }

  setMode(mode: AssignMode) {
    if (this.mode === mode) return;

    this.mode = mode;
    this.clearMessages();

    if (mode === 'camera') {
      this.cameraNeedsInteraction = true;
      this.scheduleScannerStart();
      return;
    }

    this.stopScanner();
  }

  async startScanner(userInitiated = false, videoElement?: HTMLVideoElement) {
    if (this.mode !== 'camera' || this.started) return;

    this.started = true;
    this.isStartingCamera = true;
    this.scannerStopped = false;
    this.cameraNeedsInteraction = false;

    if (userInitiated) {
      this.clearMessages();
    }

    this.zone.run(() => {
      this.isActive = false;
      this.cdr.detectChanges();
    });

    try {
      if (!userInitiated) {
        await this.waitForDomSettle(350);
      }

      const video = videoElement || this.videoRef?.nativeElement;

      if (!video) {
        throw new Error('Video element not ready');
      }

      this.prepareVideoElement(video);

      this.controls = await this.scanner.decodeFromConstraints(
        this.getCameraConstraints(),
        video,
        (result, err) => {
          if (result) {
            this.zone.run(() => {
              this.scannedTicket = result.getText();
              this.stopScanner();
              this.cdr.detectChanges();
            });
          }

          if (err && err.name !== 'NotFoundException') {
            console.warn('scan err:', err);
          }
        }
      );

      await this.waitForDomSettle(250);

      this.zone.run(() => {
        this.isStartingCamera = false;
        this.isActive = true;
        this.cameraNeedsInteraction = false;
        this.cdr.detectChanges();
      });
    } catch (e: any) {
      this.zone.run(() => {
        this.error = this.getCameraErrorMessage(e);
        this.messages.add({ severity: 'error', summary: 'Kamera', detail: this.error });
        this.isActive = false;
        this.isStartingCamera = false;
        this.cameraNeedsInteraction = true;
        this.scannerStopped = true;
        this.started = false;
        this.cdr.detectChanges();
      });
    }
  }

  stopScanner() {
    this.scannerStopped = true;
    this.isActive = false;
    this.isStartingCamera = false;

    if (this.controls) {
      this.controls.stop?.();
      this.controls = null;
    }

    this.started = false;
  }

  restartScanner() {
    this.stopScanner();
    this.scannedTicket = null;
    this.headphonesId = null;
    this.cameraNeedsInteraction = true;
    this.scheduleScannerStart();
  }

  assignScanned() {
    if (!this.scannedTicket || !this.headphonesId || this.isAssigning) return;

    this.isAssigning = true;
    this.clearMessages();

    this.api.assignHeadphones(this.scannedTicket, this.headphonesId)
      .subscribe({
        next: () => {
          this.success = 'Słuchawki zostały przypisane.';
          this.messages.add({ severity: 'success', summary: 'Przypisano', detail: this.success });
          this.isAssigning = false;
          this.restartScanner();
        },
        error: err => {
          console.error(err);
          this.showError(err, 'Nie udało się przypisać słuchawek.');
          this.isAssigning = false;
        }
      });
  }

  assignManual() {
    const email = this.manualEmail.trim();

    if (!email || !this.manualHeadphonesId || this.isAssigning) return;

    this.isAssigning = true;
    this.clearMessages();

    this.api.assignHeadphonesManually({
      email,
      headphonesId: this.manualHeadphonesId
    }).subscribe({
      next: () => {
        this.success = 'Słuchawki zostały przypisane ręcznie.';
        this.messages.add({ severity: 'success', summary: 'Przypisano', detail: this.success });
        this.isAssigning = false;
        this.resetManualForm();
      },
      error: err => {
        console.error(err);
        this.showError(err, 'Nie udało się przypisać słuchawek ręcznie.');
        this.isAssigning = false;
      }
    });
  }

  resetManualForm() {
    this.manualEmail = '';
    this.manualHeadphonesId = null;
  }

  private scheduleScannerStart() {
    if (this.isIosLike()) {
      this.cameraNeedsInteraction = true;
      return;
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.startScanner();
      });
    }, 300);
  }

  private clearMessages() {
    this.error = null;
    this.success = null;
  }

  private showError(error: unknown, fallback: string) {
    this.error = resolveApiErrorMessage(error, fallback);
    this.messages.add({ severity: 'error', summary: 'Błąd', detail: this.error });
  }

  private prepareVideoElement(video: HTMLVideoElement) {
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
  }

  private getCameraConstraints(): MediaStreamConstraints {
    return {
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
  }

  private waitForDomSettle(ms: number) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        requestAnimationFrame(() => resolve());
      }, ms);
    });
  }

  private getCameraErrorMessage(error: any): string {
    const name = error?.name || '';

    if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
      return 'Nie udało się uzyskać dostępu do kamery. Dotknij "Włącz kamerę" i zaakceptuj uprawnienie w iOS.';
    }

    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return 'Nie znaleziono kamery w tym urządzeniu.';
    }

    if (name === 'NotReadableError' || name === 'TrackStartError') {
      return 'Kamera jest zajęta przez inną aplikację albo przeglądarka nie może jej uruchomić.';
    }

    return error?.message || 'Nie udało się uruchomić kamery.';
  }

  private isIosLike(): boolean {
    const platform = navigator?.platform || '';
    const userAgent = navigator?.userAgent || '';

    return /iPad|iPhone|iPod/.test(userAgent) ||
      (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
}
