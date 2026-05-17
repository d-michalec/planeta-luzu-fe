import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUsers } from './registered-users';

describe('RegisteredUsers', () => {
  let component: RegisteredUsers;
  let fixture: ComponentFixture<RegisteredUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
