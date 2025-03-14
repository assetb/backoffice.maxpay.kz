import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";

function Payments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.safepay.kg/admin/payment/get-payments", {});
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTypeLabel = type => {
    switch (type) {
      case 0:
        return "Прием";
      case 1:
        return "Выплата";
      case 2:
        return "RECURRENT";
      case 3:
        return "RECURRENT_PAYOUT";
      case 4:
        return "APPLE_PAY";
      case 5:
        return "PHONE_PAYOUT";
      case 6:
        return "ONE_TIME_PAYMENT";
      case 7:
        return "P2P";
      case 8:
        return "SAMSUNG_PAY";
      case 10:
        return "GOOGLE_PAY";
      case 11:
        return "Перевод";
      case 13:
        return "TRANSIT";
      default:
        return "Неизвестно";
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 0:
        return "Новый";
      case 1:
        return "Успех";
      case 2:
        return "В процессе";
      case 6:
        return "Фейл";
      default:
        return "Неизвестно";
    }
  };

  const columns = [
    { name: "ID", selector: row => row.id, sortable: true },
    { name: "Type", selector: row => getTypeLabel(row.type), sortable: true },
    { name: "Status", selector: row => getStatusLabel(row.status), sortable: true },
    { name: "Amount", selector: row => row.amount, sortable: true },
    { name: "Created At", selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
    { name: "Updated At", selector: row => new Date(row.updated_at).toLocaleString(), sortable: true }
  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments.xlsx");
  };

  return (
    <div>
      <h1>Данные платежей</h1>
      <button onClick={exportToExcel} style={{ marginBottom: "10px", padding: "8px", cursor: "pointer" }}>
        📥 Экспорт в Excel
      </button>
      <DataTable
        title="Таблица платежей"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default Payments;
