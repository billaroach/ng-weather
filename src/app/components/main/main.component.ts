import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import OSM from 'ol/source/OSM';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
    public _map$ = new ReplaySubject<Map>(1);

    private destroy$ = new Subject<void>();

	public ngOnInit(): void {
		
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
}
