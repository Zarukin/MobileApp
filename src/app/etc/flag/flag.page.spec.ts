import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlagPage } from './flag.page';

describe('FlagPage', () => {
  let component: FlagPage;
  let fixture: ComponentFixture<FlagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
