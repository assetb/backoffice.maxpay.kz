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

  const getIsTestLabel = isTest => (isTest ? "Да" : "Нет");
  const getTrTypeLabel = trType => (trType === 1 ? "Двустадийный" : "");

  const columns = [
    { name: "Тестовый", selector: row => getIsTestLabel(row.is_test), sortable: true },
    { name: "ID", selector: row => row.id, sortable: true },
    { name: "Мерчант", selector: row => row.merchant_id, sortable: true },
    { name: "Номер заказа", selector: row => row.reference_id, sortable: true },
    { name: "Тип", selector: row => getTypeLabel(row.type), sortable: true },
    { name: "Статус", selector: row => getStatusLabel(row.status), sortable: true },
    { name: "Маска карты", selector: row => row.masked_pan, sortable: true },
    { name: "Сумма", selector: row => row.amount, sortable: true },
    { name: "Валюта", selector: row => row.currency, sortable: true },
    { name: "Назначение", selector: row => row.description, sortable: true },
    { name: "Коммент", selector: row => row.comment, sortable: true },
    { name: "Комиссия банка", selector: row => row.bank_commission, sortable: true },
    { name: "Комиссия мерчанта", selector: row => row.merchant_commission, sortable: true },
    { name: "Сумма возврата", selector: row => row.refund_amount, sortable: true },
    { name: "Причина Возврата", selector: row => row.refund_reason, sortable: true },
    { name: "ID юзера", selector: row => row.user_id, sortable: true },
    { name: "Телефон", selector: row => row.user_phone, sortable: true },
    { name: "Email", selector: row => row.user_email, sortable: true },
    { name: "Время завершения", selector: row => row.finished_at, sortable: true },
    { name: "Время создания", selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
    { name: "Эквайер", selector: row => row.acquirer_id, sortable: true },
    { name: "Эмитент", selector: row => row.bank_id, sortable: true },
    { name: "Попытки", selector: row => row.try, sortable: true },
    { name: "IP", selector: row => row.ip, sortable: true },
    { name: "TR тип", selector: row => getTrTypeLabel(row.tr_type), sortable: true },
    { name: "URL коллбэка", selector: row => row.back_url, sortable: true },
    { name: "URL мерчанта", selector: row => row.request_url, sortable: true },
    { name: "URL фейла", selector: row => row.fail_url, sortable: true },
    { name: "РРН", selector: row => row.rrn, sortable: true }
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
