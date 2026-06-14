import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, interval, map, startWith } from 'rxjs';
import { MainNavbar } from '../main-navbar/main-navbar';
import { EventApiService } from '../../shared/services/event/event.api.service';
import { EventDto } from '../../shared/services/event/event.model';

type HeroSlide = {
  image: string;
  alt: string;
  position: string;
};

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type EventCountdownState = {
  event: EventDto | null;
  countdown: Countdown;
};

@Component({
  selector: 'app-landing',
  imports: [RouterLink, MainNavbar, AsyncPipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy {
  private eventApi = inject(EventApiService);
  private eventSubject = new BehaviorSubject<EventDto | null>(null);

  readonly heroSlides: HeroSlide[] = [
    {
      image: 'landing/DSC08486.jpg',
      alt: 'Uczestnicy imprezy Planeta Luzu',
      position: 'center 22%',
    },
    {
      image: 'landing/DSC08457.jpg',
      alt: 'Silent Disco Planeta Luzu',
      position: 'center 24%',
    },
    {
      image: 'landing/DSC08463.jpg',
      alt: 'Parkiet podczas Silent Disco',
      position: 'center 24%',
    },
    {
      image: 'landing/DSC00633.jpeg',
      alt: 'Klimat wydarzenia Planeta Luzu',
      position: 'center 26%',
    },
    {
      image: 'landing/DSC00602.jpeg',
      alt: 'Silent Disco Planeta Luzu',
      position: 'center 24%',
    },
    {
      image: 'landing/DSC00519.jpeg',
      alt: 'Goście wydarzenia Planeta Luzu',
      position: 'center 28%',
    },
    {
      image: 'landing/DSC08587.jpg',
      alt: 'Atmosfera Silent Disco Planeta Luzu',
      position: 'center 30%',
    },
  ];

  activeSlideIndex = 0;

  readonly eventCountdown$ = combineLatest([
    this.eventSubject,
    interval(1000).pipe(startWith(0)),
  ]).pipe(
    map(([event]) => ({
      event,
      countdown: this.createCountdown(event),
    }) satisfies EventCountdownState)
  );

  private readonly autoplayInterval = window.setInterval(() => this.nextSlide(), 5200);

  ngOnInit(): void {
    this.loadEvent();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.autoplayInterval);
    this.eventSubject.complete();
  }

  private loadEvent(): void {
    this.eventApi.getCurrentEvent().subscribe({
      next: response => {
        this.eventSubject.next(this.normalizeEvent(response));
      },
      error: () => {
        this.eventSubject.next(null);
      },
    });
  }

  previousSlide(): void {
    this.activeSlideIndex =
      (this.activeSlideIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  nextSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.heroSlides.length;
  }

  setSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  private normalizeEvent(response: unknown): EventDto | null {
    if (!response) {
      return null;
    }

    if (Array.isArray(response)) {
      return response.length > 0 ? this.normalizeEvent(response[0]) : null;
    }

    if (typeof response === 'object') {
      const event = response as Partial<EventDto>;

      if (event.id != null && event.name && event.date) {
        return {
          id: Number(event.id),
          name: String(event.name),
          date: String(event.date),
          price: Number(event.price ?? 0),
          createdAt: event.createdAt ? String(event.createdAt) : '',
        };
      }
    }

    return null;
  }

  private createCountdown(event: EventDto | null): Countdown {
    if (!event) {
      return this.emptyCountdown();
    }

    const eventTime = new Date(event.date).getTime();
    if (Number.isNaN(eventTime)) {
      return this.emptyCountdown();
    }

    const distance = Math.max(0, eventTime - Date.now());
    const totalSeconds = Math.floor(distance / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: this.pad(days),
      hours: this.pad(hours),
      minutes: this.pad(minutes),
      seconds: this.pad(seconds),
    };
  }

  private emptyCountdown(): Countdown {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
