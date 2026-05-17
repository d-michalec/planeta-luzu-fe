import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnHeadphonesDialog } from './return-headphones-dialog';

describe('ReturnHeadphonesDialog', () => {
  let component: ReturnHeadphonesDialog;
  let fixture: ComponentFixture<ReturnHeadphonesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnHeadphonesDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnHeadphonesDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
