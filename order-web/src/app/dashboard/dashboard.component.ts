import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Helper } from '../helpers/helper';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';

export interface Label { }
export interface ChartDataSets {
  data: any[];
  label: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  helper: Helper = new Helper();
  orderList: any[] = [];

  // Bar chart
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  // public barChartLabels: Label[] = ['2015', '2016', '2017', '2018', '2019', '2020'];
  public barChartLabels: Label[] = [];
  public barChartType: string = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [];

  // Pie chart
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        }
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    // labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    labels: [],
    datasets: [{
      // data: [300, 500, 100]
      data: []
    }]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(private orderService: OrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const productList = this.helper.getProductList();
    productList.forEach(el => {
      this.pieChartData.labels?.push(el.name);
      this.pieChartData.datasets[0].data.push(el.quantity);
    });

    this.orderService.getOrderList().subscribe((response: any) => {
      this.orderList = response;
      this.generateBarChart();

    });

    // this.productService.getSumProductOrderList().subscribe((response) => {
    //   let list = response as [{name: string, total: number}];
    //   if (list.length > 0) {
    //     list.forEach(el => {
    //       this.pieChartData.labels?.push(el.name);
    //       this.pieChartData.datasets[0].data.push(el.total);
    //     });
    //   }
    // });
  }

  generateBarChart() {
    let labels: any[] = [];

    this.orderList.forEach(x => {
      const m = x.createdDate.split('/');
      labels.push({ label: (`${m[1]}/${m[2]}`).toString() });
    });

    let labelList = this.count(labels);
    let dt: any[] = [];
    let lb: any[] = [];
    labelList.forEach((x: any) => {
      lb.push(x.label);
      dt.push(x.count);
    });

    setTimeout(() => {
      this.barChartLabels = lb;
      this.barChartData = [{ data: dt, label: 'Đơn hàng' }];
    }, 500);
  }

  
  generatePieChart(list: any[]) {
    let labels: any[] = [];
    let data: any[] = [];

    list.forEach(el => {
      labels.push(el.name);
      data.push(el.total);
    });

    // setTimeout(() => {
    //   this.pieChartData.labels = labels;
    //   this.pieChartData.datasets[0].data = data;
    //   this.pieChartData.datasets[0].backgroundColor = ['Yellow', 'Green', 'Pink', 'Blue'];
    // }, 1000);

    // this.pieChartData.labels = labels;
    // this.pieChartData.datasets[0].data = data;
    // this.pieChartData.datasets[0].backgroundColor = ['Yellow', 'Green', 'Pink', 'Blue'];
  }

  count(list: any[]) {
    const convert = (list: any[]) => {
      const res: any = {};
      list.forEach((obj: any) => {
        const key = `${obj.label}`;
        if (!res[key]) {
          res[key] = { ...obj, count: 0 };
        };
        res[key].count += 1;
      });
      return Object.values(res);
    };
    console.log(convert(list));
    return convert(list);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  public chartClicked(event: any): void {
    console.log(event);
  }

  public chartHovered(event: any): void {
    console.log(event);
  }
}
