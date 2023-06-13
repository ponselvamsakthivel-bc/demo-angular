import { Component, ElementRef, ViewChild } from '@angular/core';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pdf-app';

  @ViewChild('tableToExport') tableToExport: ElementRef | any;
  users = [
    { name: 'Ajith Muthukumar', email: 'ajith.muthukumar@brickendon.com', country: 'India', imageUrl: 'https://source.unsplash.com/user/c_v_r/100x100' },
    { name: 'Jane Doe', email: 'jane.doe@example.com', country: 'Canada', imageUrl: 'https://source.unsplash.com/user/c_v_r/100x100' }
  ];

  constructor(private http: HttpClient) {}

  exportToPdf() {
    var data: any = document.getElementById('contentToConvert');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }

  getImageDataUrl(imageUrl: string): Promise<string> {
    return this.http.get(imageUrl, { responseType: 'blob' })
      .toPromise()
      .then((blob: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

  async ngOnInit() {
    for (const user of this.users) {
      user.imageUrl = await this.getImageDataUrl(user.imageUrl);
    }
  }
}
