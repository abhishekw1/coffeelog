import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../data.service';
import { Coffee } from '../logic/Coffee';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { GeolocationService } from '../geolocation.service';
import { UiService } from '../ui.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  dataService = inject(DataService);
  router = inject(Router);
  geolocation = inject(GeolocationService);
  uiService = inject(UiService);

  lists: Coffee[] = [];

  ngOnInit(): void {
    this.uiService.setTitle('Coffees');
    this.uiService.setTheamColor('Yellow');
    this.dataService.getList((lists: Coffee[]) => {
      this.lists = lists;
    });
  }

  goDetails(coffee: Coffee) {
    this.router.navigate(['/coffee', coffee._id]);
  }

  share(coffee: Coffee) {
    const text = `I had this coffee at ${coffee.place} and for me it's ${coffee.rating} stars.`;

    navigator.share({
      title: coffee.name,
      text: text,
      url: window.location.href,
    });
  }
  goMap(coffee: Coffee) {
    const mapUrl = this.geolocation.getMapLink(coffee.location!);
    window.open(mapUrl, '_blank');
  }
}
