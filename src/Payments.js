import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";

function Payments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
        return "Рекуррент";
      case 3:
        return "Рекуррентный вывод";
      case 4:
        return "APPLE PAY";
      case 5:
        return "Вывод на телефон";
      case 6:
        return "Подписка";
      case 7:
        return "P2P";
      case 8:
        return "SAMSUNG PAY";
      case 10:
        return "GOOGLE PAY";
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

  const getIsTestLabel = isTest => (isTest ? "Да" : "Нет");
  const getTrTypeLabel = trType => (trType === 1 ? "Двустадийный" : "");

  const handleRowClick = async row => {
    setSelectedRow(row.id);
    setLogs(null);
    try {
      const response = await axios.post("https://api.safepay.kg/admin/payment/payments/logs", { id: row.id });
      setLogs(response.data);
    } catch (error) {
      console.error("Ошибка при получении логов:", error);
      setLogs("Ошибка при загрузке логов");
    }
  };

  const columns = [
    { name: "Тестовый", selector: row => getIsTestLabel(row.is_test), sortable: true, width: "120px" },
    { name: "ID", selector: row => row.id, sortable: true, width: "100px" },
    { name: "Мерчант", selector: row => row.merchant_id, sortable: true, width: "120px" },
    { name: "Номер заказа", selector: row => row.reference_id, sortable: true, width: "150px" },
    { name: "Тип", selector: row => getTypeLabel(row.type), sortable: true, width: "150px" },
    { name: "Статус", selector: row => getStatusLabel(row.status), sortable: true, width: "120px" },
    { name: "Маска карты", selector: row => row.masked_pan, sortable: true },
    { name: "Сумма", selector: row => row.amount, sortable: true, width: "120px" },
    { name: "Валюта", selector: row => row.currency, sortable: true, width: "100px" },
    { name: "Назначение", selector: row => row.description, sortable: true, width: "150px" },
    { name: "Коммент", selector: row => row.comment, sortable: true, width: "150px" },
    { name: "Комиссия банка", selector: row => row.bank_commission, sortable: true, width: "120px" },
    { name: "Комиссия мерчанта", selector: row => row.merchant_commission, sortable: true, width: "120px" },
    { name: "Сумма возврата", selector: row => row.refund_amount, sortable: true, width: "120px" },
    { name: "Причина Возврата", selector: row => row.refund_reason, sortable: true, width: "150px" },
    { name: "ID юзера", selector: row => row.user_id, sortable: true, width: "120px" },
    { name: "Телефон", selector: row => row.user_phone, sortable: true, width: "150px" },
    { name: "Email", selector: row => row.user_email, sortable: true, width: "150px" },
    { name: "Время завершения", selector: row => row.finished_at, sortable: true, width: "150px" },
    {
      name: "Время создания",
      selector: row => new Date(row.created_at).toLocaleString(),
      sortable: true,
      width: "150px"
    },
    { name: "Эквайер", selector: row => row.acquirer_id, sortable: true, width: "120px" },
    { name: "Эмитент", selector: row => row.bank_id, sortable: true, width: "120px" },
    { name: "Попытки", selector: row => row.try, sortable: true, width: "100px" },
    { name: "IP", selector: row => row.ip, sortable: true, width: "150px" },
    { name: "TR тип", selector: row => getTrTypeLabel(row.tr_type), sortable: true, width: "150px" },
    { name: "URL коллбэка", selector: row => row.back_url, sortable: true, width: "200px" },
    { name: "URL мерчанта", selector: row => row.request_url, sortable: true, width: "200px" },
    { name: "URL фейла", selector: row => row.fail_url, sortable: true, width: "200px" },
    { name: "РРН", selector: row => row.rrn, sortable: true, width: "150px" }
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
        onRowClicked={handleRowClick}
        pointerOnHover
      />
      {logs && selectedRow && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#f9f9f9"
          }}>
          <h2>Логи платежа ID: {selectedRow}</h2>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Payments;
