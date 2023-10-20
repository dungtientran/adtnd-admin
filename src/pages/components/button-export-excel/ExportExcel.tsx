import { Button } from 'antd';
import * as ExcelJS from 'exceljs';

interface IExportExcel {
  dataSource?: any;
  columns?: any;
}

const ExportExcel: React.FC<IExportExcel> = ({ columns, dataSource }) => {
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dữ liệu');

    worksheet.columns = columns.map((col: any) => ({ header: col.title, key: col.dataIndex }));

    dataSource.forEach((record: any) => {
      const row = columns.map((col: any) => {
        // console.log('col__________________', col);
        return record[col.dataIndex];
      });

      // console.log('row______________', row);
      worksheet.addRow(row);
    });

    // console.log('worksheet_____________________', worksheet);

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = 'data.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button type="primary" onClick={exportToExcel}>
      Xuất Excel
    </Button>
  );
};

export default ExportExcel;
