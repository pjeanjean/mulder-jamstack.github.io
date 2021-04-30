import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMdComponent } from './dynamic-md.component';

describe('DynamicMdComponent', () => {
  let component: DynamicMdComponent;
  let fixture: ComponentFixture<DynamicMdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicMdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
