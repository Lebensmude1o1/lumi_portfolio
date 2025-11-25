import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyBdayComponent } from './happy-bday.component';

describe('HappyBdayComponent', () => {
  let component: HappyBdayComponent;
  let fixture: ComponentFixture<HappyBdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyBdayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappyBdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
