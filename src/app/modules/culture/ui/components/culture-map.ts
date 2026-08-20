import {
  Component,
  ElementRef,
  input,
  output,
  viewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import * as L from 'leaflet';

export interface MapMarker {
  name: string;
  lat: number;
  lon: number;
  onClick?: () => void;
}

export interface MapPoint {
  lat: number;
  lon: number;
}

const PIN_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0"/></svg>';

function makeIcon(color: string, name: string): L.DivIcon {
  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="width:32px;height:32px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.25)">${PIN_SVG}</div>
      <div style="background:${color};border-radius:999px;padding:2px 8px;white-space:nowrap;font-family:Montserrat,sans-serif;font-size:10.5px;font-weight:700;color:white;line-height:1.4">${name}</div>
    </div>`;
  return L.divIcon({ className: '', html, iconSize: [80, 56], iconAnchor: [40, 56] });
}

@Component({
  selector: 'app-culture-map',
  template: `
    <div class="w-full overflow-hidden rounded-2xl border border-surface-200 shadow-sm" [style.height]="height()">
      <div #mapContainer class="h-full w-full"></div>
    </div>
  `,
})
export class CultureMapComponent implements AfterViewInit, OnDestroy {
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  readonly markers = input<MapMarker[]>([]);
  readonly selectable = input<boolean>(false);
  readonly zoom = input<number>(12);
  readonly center = input<{ lat: number; lon: number }>();
  readonly height = input<string>('400px');

  readonly pointSelect = output<MapPoint>();

  private map: L.Map | null = null;
  private markerLayer: L.LayerGroup | null = null;
  private selectedLayer: L.LayerGroup | null = null;
  private pendingMarkers: MapMarker[] = [];

  private readonly BLUE = '#1A3CD0';
  private readonly CYAN = '#11C2DA';

  ngAfterViewInit(): void {
    const el = this.mapContainer().nativeElement;
    const c = this.center() ?? { lat: 8.9824, lon: -79.5199 };

    this.map = L.map(el, { center: [c.lat, c.lon], zoom: this.zoom(), zoomControl: false });
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.selectedLayer = L.layerGroup().addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.selectable()) return;
      this.selectedLayer!.clearLayers();
      L.marker([e.latlng.lat, e.latlng.lng], { icon: makeIcon(this.CYAN, 'Seleccionado') }).addTo(this.selectedLayer!);
      this.pointSelect.emit({ lat: e.latlng.lat, lon: e.latlng.lng });
    });

    setTimeout(() => {
      this.map!.invalidateSize();
      if (this.pendingMarkers.length) {
        this.applyMarkers(this.pendingMarkers);
        this.pendingMarkers = [];
      } else {
        this.applyMarkers(this.markers());
      }
    }, 300);
  }

  refreshMarkers(markers: MapMarker[]): void {
    if (this.map) {
      this.applyMarkers(markers);
    } else {
      this.pendingMarkers = markers;
    }
  }

  private applyMarkers(markers: MapMarker[]): void {
    if (!this.markerLayer || !this.map) return;
    this.markerLayer.clearLayers();

    for (const m of markers) {
      const leafletMarker = L.marker([m.lat, m.lon], { icon: makeIcon(this.BLUE, m.name) }).addTo(this.markerLayer);
      if (m.onClick) leafletMarker.on('click', m.onClick);
    }

    if (markers.length === 1) {
      this.map.setView([markers[0].lat, markers[0].lon], this.zoom());
    } else if (markers.length > 1) {
      this.map.fitBounds(L.latLngBounds(markers.map((m) => [m.lat, m.lon])), { padding: [50, 50] });
    }

    setTimeout(() => this.map?.invalidateSize(), 50);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
