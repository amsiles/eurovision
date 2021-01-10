import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { CitiesService } from './cities.service';
import { City} from './city.model';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
  providers: [CitiesService]
})
export class CitiesComponent implements AfterViewInit, OnInit {
  // Number of total elements in the datasource of the table
  totalElements: number;
  dataSource: CityDataSource;
  // columns displayed in the table
  displayedColumns = ['id', 'name'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private citiesService: CitiesService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.dataSource = new CityDataSource(this.citiesService);
    this.cdr.detectChanges();
    // We firstly detect the total elements of the data source
    this.dataSource.getTotalElements().subscribe(items => this.totalElements = items);
    // And then we get the corresponding five first elements
    this.dataSource.loadCities(0, 5);
  }

  ngAfterViewInit(): void{
    this.paginator.page
      .pipe(
        tap(() => this.loadCitiesPage())
      )
      .subscribe();
  }

  loadCitiesPage(): void {
    this.dataSource.loadCities(this.paginator.pageIndex, this.paginator.pageSize);
  }

}

export class CityDataSource implements DataSource<City> {

  private citiesSubject = new BehaviorSubject<City[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private citiesService: CitiesService) {}

  connect(collectionViewer: CollectionViewer): Observable<City[]> {
    return this.citiesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.citiesSubject.complete();
    this.loadingSubject.complete();
  }

  loadCities(pageIndex: number, pageSize: number): void{

    this.loadingSubject.next(true);

    this.citiesService.findCities(pageIndex, pageSize)
      .pipe(
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(cities => this.citiesSubject.next(cities));
  }

  getTotalElements(): Observable<number>{
    return this.citiesService.findNumberCities();
  }
}
