import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './header/header.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Omniverzum-könyvtár';

  constructor(private primeNgConfig: PrimeNGConfig) {
    this.initPrimeNgConfig();
  }

  private initPrimeNgConfig(): void {
    this.primeNgConfig.setTranslation({
      dayNamesMin: ['Va', 'Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo'],
      dayNamesShort: ['Vas', 'Hét', 'Kedd', 'Szer', 'Csüt', 'Pén', 'Szom'],
      monthNames: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
      dateFormat: 'yy.mm.dd',
      firstDayOfWeek: 1
    });
  }

}
