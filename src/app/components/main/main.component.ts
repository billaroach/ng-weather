import { Component, OnDestroy, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { ReplaySubject, Observable, Subject, takeUntil } from 'rxjs';
import OSM from 'ol/source/OSM';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
    public _map$ = new ReplaySubject<Map>(1);

    private destroy$ = new Subject<void>();

	public ngOnInit(): void {
		this.createMap();
	}

    public ngOnDestroy(): void {
        this.destroy$.next();
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

    public setMapContainer(): void {
        this.map$
        .pipe(takeUntil(this.destroy$))
        // .subscribe(map => )
    }

    public get map$(): Observable<Map> {
        return this._map$.asObservable();
    }
}
