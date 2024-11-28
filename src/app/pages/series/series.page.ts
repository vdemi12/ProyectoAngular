import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Serie } from 'src/app/core/models/serie.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { SeriesService } from 'src/app/core/services/impl/series.service';


@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {

  _series:BehaviorSubject<Serie[]> = new BehaviorSubject<Serie[]>([]);
  series$:Observable<Serie[]> = this._series.asObservable();

  constructor(
    private animationCtrl: AnimationController,
    private seriesSvc:SeriesService
  ) {}

  ngOnInit(): void {
    this.getMoreSeries();
  }


  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedSerie: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;


  getMoreSeries(notify:HTMLIonInfiniteScrollElement | null = null) {
    this.seriesSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Serie>)=>{
        this._series.next([...this._series.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  async openSerieDetail(Serie: any, index: number) {
    this.selectedSerie = Serie;
    
    /*
    const avatarElements = this.avatars.toArray();
    const clickedAvatar = avatarElements[index].nativeElement;

    // Obtener las coordenadas del avatar clicado
    const avatarRect = clickedAvatar.getBoundingClientRect();

    // Mostrar el contenedor animado
    this.isAnimating = true;
    

    // Configurar la posición inicial de la imagen animada
    const animatedAvatarElement = this.animatedAvatar.nativeElement as HTMLElement;
    animatedAvatarElement.style.position = 'absolute';
    animatedAvatarElement.style.top = `${avatarRect.top}px`;
    animatedAvatarElement.style.left = `${avatarRect.left}px`;
    animatedAvatarElement.style.width = `${avatarRect.width}px`;
    animatedAvatarElement.style.height = `${avatarRect.height}px`;

    // Crear la animación
    const animation = this.animationCtrl.create()
      .addElement(animatedAvatarElement)
      .duration(500)
      .easing('ease-out')
      .fromTo('transform', 'translate(0, 0) scale(1)', `translate(${window.innerWidth / 2 - avatarRect.left - avatarRect.width / 2}px, ${window.innerHeight / 2 - avatarRect.top - avatarRect.height / 2}px) scale(5)`);

    // Iniciar la animación
    await animation.play();

    // Opcional: Puedes agregar lógica adicional después de la animación
    // Por ejemplo, mostrar más información, navegar a otra página, etc.

    // Resetear la animación después de completarla
    //this.isAnimating = false;
    */
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreSeries(ev.target); 
  }
}
