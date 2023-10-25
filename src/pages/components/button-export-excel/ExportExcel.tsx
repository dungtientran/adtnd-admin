import { Button } from 'antd';
import * as ExcelJS from 'exceljs';

interface IExportExcel {
  dataSource?: any;
  columns?: any;
  title?: string;
}

const ExportExcel: React.FC<IExportExcel> = ({ columns, dataSource, title }) => {
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

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
      a.download = `${title}.xlsx`;
      a.click();

      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Button type="primary" onClick={exportToExcel} disabled={dataSource && dataSource?.length > 0 ? false : true}>
      Xuất Excel
    </Button>
  );
};

export default ExportExcel;
