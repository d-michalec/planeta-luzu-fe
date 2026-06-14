import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainNavbar } from '../main-navbar/main-navbar';

type StaticPageSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type StaticPageData = {
  eyebrow: string;
  title: string;
  lead: string;
  sections: StaticPageSection[];
};

@Component({
  selector: 'app-static-page',
  imports: [MainNavbar],
  templateUrl: './static-page.html',
  styleUrl: './static-page.css',
})
export class StaticPage {
  private readonly route = inject(ActivatedRoute);

  readonly page = this.route.snapshot.data as StaticPageData;
}
