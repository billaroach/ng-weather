import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Map, MapBrowserEvent, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { ReplaySubject, Observable, Subject, takeUntil, switchMap } from 'rxjs';
import OSM from 'ol/source/OSM';
import { Coordinate } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
    public _map$ = new ReplaySubject<Map>(1);

    private mapClicksListener?: (event: MapBrowserEvent<UIEvent>) => void;

    private destroy$ = new Subject<void>();

	public ngOnInit(): void {
		this.getMapClicks();
	}

    public ngOnDestroy(): void {
        this.destroy$.next();
    }

    public ngAfterViewInit(): void {
        this.createMap();
    }

    public createMap(): void {
        const map = new Map({
            view: new View({
                center: [0, 0],
                zoom: 1,
            }),
            layers: [
                new TileLayer({
                    source: new OSM(),
                })
            ],
            target: 'ol-map',
        });
        
        this._map$.next(map);
    }

    public get map$(): Observable<Map> {
        return this._map$.asObservable();
    }

    public getMapClicks(): void {
        this.map$
            .pipe(
                switchMap(olMap => new Observable<Coordinate>(subscriber => {
                    this.mapClicksListener = (event) => {
                        subscriber.next(toLonLat(event.coordinate));
                    };
                    olMap.on('singleclick', this.mapClicksListener);
                    return { unsubscribe: () => this.stopGetMapClicks() }
                })),
                takeUntil(this.destroy$),
            )
            .subscribe(coordinate => console.log(coordinate));
    }

    public stopGetMapClicks(): void {
        this.map$
            .subscribe(olMap => {
                if (!this.mapClicksListener) return;
                olMap.un('singleclick', this.mapClicksListener);
                this.mapClicksListener = undefined;
            });
    }
}
