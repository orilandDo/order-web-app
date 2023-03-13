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
import { SERVICE_TYPE } from '../constants/const-data';
import { Helper } from '../helpers/helper';

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

  helper = new Helper();
  hasData: boolean = false;

  constructor(public dialog: MatDialog,
    private agencyService: AgencyService,
  ) { }

  ngOnInit(): void {
    const agencyList = this.helper.getAgencyList();
    const userList = this.helper.getUserList();
    if (agencyList.length === 0) {
      this.agencyService.getAgencyList().subscribe((response: any) => {
        console.log(response)
        this.dataSource.data = response.reverse();
        this.dataSource.data.forEach(element => {
          const user = userList.find(x => x.id === element.userId);
          element.accountName = user ? user.username : '';
          element.password = user ? user.password : '';
        });
        this.helper.setAgencyList(this.dataSource.data.reverse());
      });
    } else {
      this.dataSource.data = agencyList.reverse();
    }

    // this.dataSource.data = []
    if (this.dataSource.data.length === 0) {
      this.hasData = false;
    } else {
      this.hasData = true;
    }
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
          this.dataSource.data = [result, ...this.dataSource.data];
          this.dataSource.data = this.dataSource.data; // push obj into datasource
        }
      }
    });
  }

  onDelete(row: any) {
    console.log(row.id)
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      data: { id: row.id, type: SERVICE_TYPE.AGENCYSERVICE, content: 'Bạn chắc chắn muốn xóa nhà phân phối "' + row.fullName + '"?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      if (result) {
        this.helper.deleteAgency(row);
        this.dataSource.data = this.dataSource.data.filter(x => x.id !== row.id);
      }
      console.log(this.dataSource.data);
    });
  }

}

