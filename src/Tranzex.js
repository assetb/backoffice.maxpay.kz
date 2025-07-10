import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import * as XLSX from "xlsx";
import config from "./config";

const exportToExcel = data => {
  const worksheet = XLSX.utils.json_to_sheet(data); // Преобразуем массив данных в формат для Excel

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tranzex");

  // Указываем имя файла и формат
  const excelFileName = "tranzex.xlsx";

  // Вызываем метод для сохранения файла
  XLSX.writeFile(workbook, excelFileName);
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "5px",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
  zIndex: "9999"
};

const formatDate = date => {
  const year = date.getFullYear().toString().slice(2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль при необходимости
  const day = ("0" + date.getDate()).slice(-2); // добавляем ведущий ноль при необходимости

  return `${year}-${month}-${day}`;
};

function Tranzex() {
  const [data, setData] = useState([]);
  const [idFilter, setIdFilter] = useState("");
  const [merchantIdFilter, setMerchantIdFilter] = useState("");
  const [operatorIdFilter, setOperatorIdFilter] = useState("");
  const [panFromFilter, setPanFromFilter] = useState("");
  const [panToFilter, setPanToFilter] = useState("");
  const [mTxnIdFilter, setMTxnIdFilter] = useState("");
  const [oTxnIdFilter, setOTxnIdFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [createdAtFilter, setCreatedAtFilter] = useState("");
  const [updatedAtFilter, setUpdatedAtFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [holderFromFilter, setHolderFromFilter] = useState("");
  const [holderToFilter, setHolderToFilter] = useState("");
  const [bankFromIdFilter, setBankFromIdFilter] = useState("");
  const [bankToIdFilter, setBankToIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [createdAtFrom, setCreatedAtFrom] = useState(null);
  const [createdAtTo, setCreatedAtTo] = useState(null);
  const [logs, setLogs] = useState("");
  const [page, setPage] = useState(1); // Текущее состояние страницы
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const limit = 100; // Лимит транзакций на страницу

  const getTypeLabel = type => {
    switch (type) {
      case 0:
        return "Прием Карта";
      case 1:
        return "Вывод Карта";
      case 2:
        return "Прием ТЕЛ";
      case 3:
        return "Вывод ТЕЛ";
      case 4:
        return "Прием Счет";
      case 5:
        return "Вывод Счет";
      case 6:
        return "Прием Cross-Currency";
      case 7:
        return "Вывод Cross-Currency";
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

  const tableHeaders = ["ID", "Type", "Tranzex ID", "Request", "Response", "Created At", "Updated At"];

  const handleRowClick = async id => {
    try {
      const response = await axios.post(config.getApiUrl("/admin/tranzex/transactions/logs"), { id });
      setLogs(response.data);
    } catch (error) {
      console.error("Ошибка при получении логов:", error);
      setLogs("Ошибка при загрузке логов");
    }
  };

  const formatDateTime = dateTimeStr => {
    if (!dateTimeStr) return "";

    // Создаем объект Date из строки
    const date = new Date(dateTimeStr);

    // Извлекаем компоненты даты и времени
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    // Формируем строку в формате YYYY-MM-DD HH:MM:SS
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const dateRange =
    createdAtFrom && createdAtTo
      ? JSON.stringify({
          start: formatDate(createdAtFrom),
          end: formatDate(createdAtTo)
        })
      : undefined;

  const fetchData = async () => {
    setLoading(true);
    const filters = {
      page,
      limit,
      id: idFilter ? parseInt(idFilter) : undefined,
      merchant_id: merchantIdFilter ? parseInt(merchantIdFilter) : undefined,
      operator_id: operatorIdFilter ? parseInt(operatorIdFilter) : undefined,
      pan_from: panFromFilter || undefined,
      pan_to: panToFilter || undefined,
      m_txn_id: mTxnIdFilter || undefined,
      o_txn_id: oTxnIdFilter || undefined,
      amount: amountFilter ? parseFloat(amountFilter) : undefined,
      currency: currencyFilter || undefined,
      created_at: createdAtFilter || undefined,
      updated_at: updatedAtFilter || undefined,
      type: typeFilter ? parseInt(typeFilter) : undefined,
      holder_from: holderFromFilter || undefined,
      holder_to: holderToFilter || undefined,
      bank_from_id: bankFromIdFilter ? parseInt(bankFromIdFilter) : undefined,
      bank_to_id: bankToIdFilter ? parseInt(bankToIdFilter) : undefined,
      status: statusFilter ? parseInt(statusFilter) : undefined,
      user_id: userIdFilter ? parseInt(userIdFilter) : undefined,
      date_range: dateRange
    };

    try {
      const response = await axios.post(config.getApiUrl("/admin/tranzex/get-transactions"), filters);
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    idFilter,
    merchantIdFilter,
    operatorIdFilter,
    panFromFilter,
    panToFilter,
    mTxnIdFilter,
    oTxnIdFilter,
    amountFilter,
    currencyFilter,
    createdAtFilter,
    updatedAtFilter,
    typeFilter,
    holderFromFilter,
    holderToFilter,
    bankFromIdFilter,
    bankToIdFilter,
    statusFilter,
    userIdFilter,
    createdAtFrom,
    createdAtTo
  ]);

  const handleApplyFilters = () => {
    setPage(1); // Сбрасываем страницу на первую при применении новых фильтров
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <React.StrictMode>
      <div className="a">
        <h1 className="h">Данные платежей</h1>
      </div>
      <div className="table-wrapper">
        {/* Фильтры и подсказки */}
        <div className="filters">
          <div className="filter-row">
            <span>ID</span>
            <input type="text" value={idFilter} onChange={e => setIdFilter(e.target.value)} placeholder="ID" />
            <span>Merchant ID</span>
            <input
              type="text"
              value={merchantIdFilter}
              onChange={e => setMerchantIdFilter(e.target.value)}
              placeholder="Merchant ID"
            />
            <span>Operator ID</span>
            <input
              type="text"
              value={operatorIdFilter}
              onChange={e => setOperatorIdFilter(e.target.value)}
              placeholder="Operator ID"
            />
            <span>PAN From</span>
            <input
              type="text"
              value={panFromFilter}
              onChange={e => setPanFromFilter(e.target.value)}
              placeholder="PAN From"
            />
          </div>
          <div className="filter-row">
            <span>PAN To</span>
            <input
              type="text"
              value={panToFilter}
              onChange={e => setPanToFilter(e.target.value)}
              placeholder="PAN To"
            />
            <span>M TXN ID</span>
            <input
              type="text"
              value={mTxnIdFilter}
              onChange={e => setMTxnIdFilter(e.target.value)}
              placeholder="M TXN ID"
            />
            <span>O TXN ID</span>
            <input
              type="text"
              value={oTxnIdFilter}
              onChange={e => setOTxnIdFilter(e.target.value)}
              placeholder="O TXN ID"
            />
            <span>Amount</span>
            <input
              type="text"
              value={amountFilter}
              onChange={e => setAmountFilter(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <div className="filter-row">
            <span>Currency</span>
            <input
              type="text"
              value={currencyFilter}
              onChange={e => setCurrencyFilter(e.target.value)}
              placeholder="Currency"
            />
            <span>Created At</span>
            <input
              type="text"
              value={createdAtFilter}
              onChange={e => setCreatedAtFilter(e.target.value)}
              placeholder="Created At"
            />
            <span>Updated At</span>
            <input
              type="text"
              value={updatedAtFilter}
              onChange={e => setUpdatedAtFilter(e.target.value)}
              placeholder="Updated At"
            />
            <span>Type</span>
            <input type="text" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} placeholder="Type" />
          </div>
          <div className="filter-row">
            <span>Holder From</span>
            <input
              type="text"
              value={holderFromFilter}
              onChange={e => setHolderFromFilter(e.target.value)}
              placeholder="Holder From"
            />
            <span>Holder To</span>
            <input
              type="text"
              value={holderToFilter}
              onChange={e => setHolderToFilter(e.target.value)}
              placeholder="Holder To"
            />
            <span>Bank From ID</span>
            <input
              type="text"
              value={bankFromIdFilter}
              onChange={e => setBankFromIdFilter(e.target.value)}
              placeholder="Bank From ID"
            />
            <span>Bank To ID</span>
            <input
              type="text"
              value={bankToIdFilter}
              onChange={e => setBankToIdFilter(e.target.value)}
              placeholder="Bank To ID"
            />
          </div>
          <div className="filter-row">
            <span>Status</span>
            <input
              type="text"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              placeholder="Status"
            />
            <span>User ID</span>
            <input
              type="text"
              value={userIdFilter}
              onChange={e => setUserIdFilter(e.target.value)}
              placeholder="User ID"
            />
          </div>
          <div className="filter-row">
            <span>Created At</span>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "15px", width: "200px" }}>
                <DatePicker
                  selected={createdAtFrom}
                  onChange={date => setCreatedAtFrom(date)}
                  selectsStart
                  startDate={createdAtFrom}
                  endDate={createdAtTo}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="From"
                  popperPlacement="right-start" // Указываем, что календарь должен раскрываться вправо
                />
              </div>
              <div>
                <DatePicker
                  selected={createdAtTo}
                  onChange={date => setCreatedAtTo(date)}
                  selectsEnd
                  startDate={createdAtFrom}
                  endDate={createdAtTo}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="To"
                  minDate={createdAtFrom}
                  popperPlacement="right-start" // Указываем, что календарь должен раскрываться вправо
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <div className="button-group">
              <button className="filter" onClick={handleApplyFilters}>
                Применить фильтры
              </button>
              <button className="export" onClick={() => exportToExcel(data)}>
                Excel
              </button>
            </div>

            <div className="pagination">
              <button onClick={handlePreviousPage} disabled={page === 1 || loading}>
                ◀
              </button>
              <span>{page}</span>
              <button onClick={handleNextPage} disabled={loading}>
                ►
              </button>
            </div>
          </div>
        </div>
        {/* Таблица данных */}
        <div className="table-container">
          <table className="custom-table">
            {/* Заголовки столбцов */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Merchant ID</th>
                <th>Operator ID</th>
                <th>PAN From</th>
                <th>PAN To</th>
                <th>M TXN ID</th>
                <th>O TXN ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Type</th>
                <th>Holder From</th>
                <th>Holder To</th>
                <th>Bank From ID</th>
                <th>Bank To ID</th>
                <th>Status</th>
                <th>User ID</th>
              </tr>
            </thead>
            {/* Данные */}
            <tbody>
              {data.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item.id)}>
                  <td>{item.id}</td>
                  <td>{item.merchant_id}</td>
                  <td>{item.operator_id}</td>
                  <td>{item.pan_from}</td>
                  <td>{item.pan_to}</td>
                  <td>{item.m_txn_id}</td>
                  <td>{item.o_txn_id}</td>
                  <td>{item.amount}</td>
                  <td>{item.currency}</td>
                  <td>{formatDateTime(item.created_at)}</td> {/* Форматируем дату и время */}
                  <td>{formatDateTime(item.updated_at)}</td> {/* Форматируем дату и время */}
                  <td>{getTypeLabel(item.type)}</td>
                  <td>{item.holder_from}</td>
                  <td>{item.holder_to}</td>
                  <td>{item.bank_from_id}</td>
                  <td>{item.bank_to_id}</td>
                  <td>{getStatusLabel(item.status)}</td>
                  <td>{item.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length > 0 && (
            <div className="modal" style={modalStyle}>
              <button className="close" variant="secondary" onClick={() => setLogs("")}>
                Закрыть
              </button>
              <h3 className="modaltable">Логи платежа</h3>
              <table>
                <thead>
                  <tr className="width">
                    {tableHeaders.map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className="width">{log.id}</td>
                      <td className="width">{log.type}</td>
                      <td className="width">{log.tranzex_id}</td>
                      <td className="width">{log.request}</td>
                      <td className="width">{log.response}</td>
                      <td className="width">{log.created_at}</td>
                      <td className="width">{log.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </React.StrictMode>
  );
}

export default Tranzex;
