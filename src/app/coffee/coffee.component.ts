import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { Coffee } from '../logic/Coffee';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TastingRating } from '../logic/TastingRating';
import { GeolocationService } from '../geolocation.service';
import { UiService } from '../ui.service';
@Component({
  selector: 'app-coffee',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './coffee.component.html',
  styleUrl: './coffee.component.scss',
})
export class CoffeeComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dataService = inject(DataService);
  geolocation = inject(GeolocationService);
  uiService = inject(UiService);

  types = ['Aroma', 'Flavor', 'Intensity', 'Sweetness', 'Aftertaste'];
  formType: 'editing' | 'inserting' = 'inserting';
  tastingEnabled: boolean = false;

  coffee = new Coffee();

  ngOnInit(): void {
    this.uiService.setTitle('New');
    this.uiService.setTheamColor('Yellow');
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.dataService.getCoffee(params['id'], (response: any) => {
          this.coffee = response; // TODO: convert the object to a Coffee instance
          this.uiService.setTitle(this.coffee.name);
          this.formType = 'editing';
          if (this.coffee.tastingRating) {
            this.tastingEnabled = true;
          }
        });
      }
    });
  }

  tastingRatingChanged(checked: boolean) {
    if (checked) {
      this.coffee.tastingRating = new TastingRating();
    } else {
      this.coffee.tastingRating = null;
    }
  }

  acquireLocation() {
    this.geolocation.requestLocation(
      (location: GeolocationCoordinates | null) => {
        if (location) {
          this.coffee.location!.latitude = location.latitude;
          this.coffee.location!.longitude = location.longitude;
        }
      }
    );
  }

  save() {
    let resultFunction = (result: boolean) => {
      if (result) {
        this.router.navigate(['/']);
      } else {
        // to log th error
      }
    };
    if (this.formType === 'inserting') {
      let { _id, ...insertCoffee } = this.coffee;
      this.dataService.save(insertCoffee, resultFunction);
    } else {
      this.dataService.save(this.coffee, resultFunction);
    }
  }
  cancel() {
    this.router.navigate(['/']);
  }
}
