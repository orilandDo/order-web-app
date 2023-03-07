import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Agency } from '../models/agency';
import { CustomPaginator } from '../common/custom-paginator';
import { DialogDeleteConfirmComponent } from '../common/dialog-delete-confirm/dialog-delete-confirm.component';
import { AGENCY_DATA } from '../mock-data/agency-data';
import { DialogDetailAgencyComponent } from './dialog-detail-agency/dialog-detail-agency.component';
import { AgencyService } from '../services/agency.service';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }  // Here
  ]
})
export class AgencyComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'address', 'phone', 'email', 'accountName', 'contract', 'note', 'deleteAction'];
  dataSource = new MatTableDataSource<Agency>(AGENCY_DATA);
  clickedRows = new Set<Agency>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private agencyService: AgencyService,
    ) { }

  ngOnInit(): void {
    // this.agencyService.getAgencytList().subscribe((response: any) => {
    //   console.log(response)
    //   this.dataSource.data = response;
    // });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onEdit(row: any) {
    console.log(row)
    const dialogRef = this.dialog.open(DialogDetailAgencyComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        if (row && row.id !== 0) {
          row.fullName = result.fullName;
          row.address = result.address;
          row.phone = result.phone;
          row.note = result.note;
          row.email = result.email;
          row.contract = result.contract;
          row.password = result.password.length !== 0 ? result.password : row.password;
        } else {
          this.dataSource.data.push(result);
          this.dataSource.data = this.dataSource.data; // push obj into datasource
        }
      }
    });
  }

  onDelete(row: any) {
    console.log(row.id)
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      data: { id: row.id, content: 'Bạn chắc chắn muốn xóa nhà phân phối "' + row.fullName + '"?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(x => x.id !== row.id);
      }
      console.log(this.dataSource.data);
    });
  }

}

