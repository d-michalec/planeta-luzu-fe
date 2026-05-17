import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHeadphones } from './assign-headphones';

describe('AssignHeadphones', () => {
  let component: AssignHeadphones;
  let fixture: ComponentFixture<AssignHeadphones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignHeadphones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHeadphones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
