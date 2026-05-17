import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadphonesDto } from './headphones.component';

describe('Headphones', () => {
  let component: HeadphonesDto;
  let fixture: ComponentFixture<HeadphonesDto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadphonesDto],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadphonesDto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
