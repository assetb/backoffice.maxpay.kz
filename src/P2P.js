import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import * as XLSX from 'xlsx';

const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data); // Преобразуем массив данных в формат для Excel

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  // Указываем имя файла и формат
  const excelFileName = 'transactions.xlsx';

  // Вызываем метод для сохранения файла
  XLSX.writeFile(workbook, excelFileName);
};

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  zIndex: '9999',
};

const formatDate = (date) => {
  const year = date.getFullYear().toString().slice(2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // добавляем ведущий ноль при необходимости
  const day = ('0' + date.getDate()).slice(-2); // добавляем ведущий ноль при необходимости

  return `${year}-${month}-${day}`;
};

function P2P() {
  const [data, setData] = useState([]); 
  const [idFilter, setIdFilter] = useState('');
  const [isTestFilter, setIsTestFilter] = useState('');
  const [acquirerIdFilter, setAcquirerIdFilter] = useState('');
  const [bankIdFilter, setBankIdFilter] = useState('');
  const [merchantIdFilter, setMerchantIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [userCommissionFilter, setUserCommissionFilter] = useState('');
  const [bankCommissionFilter, setBankCommissionFilter] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [referenceIdFilter, setReferenceIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [returnUrlFilter, setReturnUrlFilter] = useState('');
  const [backUrlFilter, setBackUrlFilter] = useState('');
  const [failUrlFilter, setFailUrlFilter] = useState('');
  const [operatorIdFilter, setOperatorIdFilter] = useState('');
  const [createdAtFrom, setCreatedAtFrom] = useState(null); 
  const [createdAtTo, setCreatedAtTo] = useState(null); 
  const [logs, setLogs] = useState('');
  const [page, setPage] = useState(1); // Текущее состояние страницы
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const limit = 100; // Лимит транзакций на страницу

  const getTypeLabel = (type) => {
    switch (type) {
      case 0:
        return 'Прием';
      case 1:
        return 'Выплата';
      case 2:
        return 'RECURRENT';
      case 3:
        return 'RECURRENT_PAYOUT';
      case 4:
        return 'APPLE_PAY';
      case 5:
        return 'PHONE_PAYOUT';  
      case 6:
        return 'ONE_TIME_PAYMENT';     
      case 7:
        return 'P2P';  
      case 8:
        return 'SAMSUNG_PAY'; 
      case 10:
        return 'GOOGLE_PAY';
      case 11:
        return 'Перевод';
      case 13:
        return 'TRANSIT'; 
      default:
        return 'Неизвестно';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Новый';
      case 1:
        return 'Успех';
      case 2:
        return 'В процессе';
      case 6:
        return 'Фейл';
      default:
        return 'Неизвестно';
    }
  };

  const tableHeaders = ["ID", "Type", "P2P Transaction ID", "Request", "Response", "Created At", "Updated At"];

  const handleRowClick = async (id) => {
    try {
      const response = await axios.post('https://testapi.maxpay.kz/admin/p2p/transactions/logs', { id });
      setLogs(response.data);
    } catch (error) {
      console.error('Ошибка при получении логов:', error);
      setLogs('Ошибка при загрузке логов');
    }
  };
 
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
  
    // Создаем объект Date из строки
    const date = new Date(dateTimeStr);
  
    // Извлекаем компоненты даты и времени
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
  
    // Формируем строку в формате YYYY-MM-DD HH:MM:SS
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const dateRange = createdAtFrom && createdAtTo ? 
  JSON.stringify({
    start: formatDate(createdAtFrom),
    end: formatDate(createdAtTo)
  }) : undefined;

  const fetchData = async () => {
    setLoading(true);
    const filters = {
      page,
      limit,
      id: idFilter.trim() !== '' ? parseInt(idFilter) : undefined,
      is_test: isTestFilter.trim() !== '' ? isTestFilter : undefined,
      acquirer_id: acquirerIdFilter.trim() !== '' ? acquirerIdFilter : undefined,
      bank_id: bankIdFilter.trim() !== '' ? bankIdFilter : undefined,
      merchant_id: merchantIdFilter.trim() !== '' ? merchantIdFilter : undefined,
      status: statusFilter.trim() !== '' ? statusFilter : undefined,
      type: typeFilter.trim() !== '' ? typeFilter : undefined,
      amount: amountFilter.trim() !== '' ? amountFilter : undefined,
      user_commission: userCommissionFilter.trim() !== '' ? userCommissionFilter : undefined,
      bank_commission: bankCommissionFilter.trim() !== '' ? bankCommissionFilter : undefined,
      ip: ipFilter.trim() !== '' ? ipFilter : undefined,
      description: descriptionFilter.trim() !== '' ? descriptionFilter : undefined,
      reference_id: referenceIdFilter.trim() !== '' ? referenceIdFilter : undefined,
      user_id: userIdFilter.trim() !== '' ? userIdFilter : undefined,
      email: emailFilter.trim() !== '' ? emailFilter : undefined,
      phone: phoneFilter.trim() !== '' ? phoneFilter : undefined,
      return_url: returnUrlFilter.trim() !== '' ? returnUrlFilter : undefined,
      back_url: backUrlFilter.trim() !== '' ? backUrlFilter : undefined,
      fail_url: failUrlFilter.trim() !== '' ? failUrlFilter : undefined,
      operator_id: operatorIdFilter.trim() !== '' ? operatorIdFilter : undefined,
      date_range: dateRange,
    };

  
    try {
      const response = await axios.post('https://testapi.maxpay.kz/admin/p2p/get-transactions', filters);
      setData(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, [page,idFilter, isTestFilter, acquirerIdFilter, bankIdFilter, merchantIdFilter, statusFilter, typeFilter, amountFilter, userCommissionFilter, bankCommissionFilter, ipFilter, descriptionFilter, referenceIdFilter, userIdFilter, emailFilter, phoneFilter, returnUrlFilter, backUrlFilter, failUrlFilter, operatorIdFilter, createdAtFrom, createdAtTo]);

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
          <h1 className='h'>Данные платежей</h1>
      </div>
      <div className="table-wrapper">
        {/* Фильтры и подсказки */}
        <div className="filters">
          <div className="filter-row">
            <span>ID</span>
            <input type="text" value={idFilter} onChange={(e) => setIdFilter(e.target.value)} placeholder="ID" /> 
            <span>Is Test</span>
            <input type="text" value={isTestFilter} onChange={(e) => setIsTestFilter(e.target.value)} placeholder="Is Test" />   
            <span>Acquirer ID</span>
            <input type="text" value={acquirerIdFilter} onChange={(e) => setAcquirerIdFilter(e.target.value)} placeholder="Acquirer ID" /> 
            <span>Bank ID</span>
            <input type="text" value={bankIdFilter} onChange={(e) => setBankIdFilter(e.target.value)} placeholder="Bank ID" />
          </div>
          <div className="filter-row"> 
            <span>Merchant ID</span>
            <input type="text" value={merchantIdFilter} onChange={(e) => setMerchantIdFilter(e.target.value)} placeholder="Merchant ID" /> 
            <span>Status</span>
            <input type="text" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="Status" />   
            <span>Type</span>
            <input type="text" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} placeholder="Type" />
            <span>Amount</span>
            <input type="text" value={amountFilter} onChange={(e) => setAmountFilter(e.target.value)} placeholder="Amount" />
          </div>
          <div className="filter-row">   
            <span>User Commission</span>
            <input type="text" value={userCommissionFilter} onChange={(e) => setUserCommissionFilter(e.target.value)} placeholder="User Commission" />
            <span>Bank Commission</span>
            <input type="text" value={bankCommissionFilter} onChange={(e) => setBankCommissionFilter(e.target.value)} placeholder="Bank Commission" /> 
            <span>IP</span>
            <input type="text" value={ipFilter} onChange={(e) => setIpFilter(e.target.value)} placeholder="IP" />
            <span>Description</span>
            <input type="text" value={descriptionFilter} onChange={(e) => setDescriptionFilter(e.target.value)} placeholder="Description" />
          </div>
          <div className="filter-row">   
            <span>Reference ID</span>
            <input type="text" value={referenceIdFilter} onChange={(e) => setReferenceIdFilter(e.target.value)} placeholder="Reference ID" />
            <span>User ID</span>
            <input type="text" value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)} placeholder="User ID" />  
            <span>Email</span>
            <input type="text" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} placeholder="Email" />
            <span>Phone</span>
            <input type="text" value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)} placeholder="Phone" />
          </div>
          <div className="filter-row">   
            <span>Return URL</span>
            <input type="text" value={returnUrlFilter} onChange={(e) => setReturnUrlFilter(e.target.value)} placeholder="Return URL" />
            <span>Back URL</span>
            <input type="text" value={backUrlFilter} onChange={(e) => setBackUrlFilter(e.target.value)} placeholder="Back URL" />  
            <span>Fail URL</span>
            <input type="text" value={failUrlFilter} onChange={(e) => setFailUrlFilter(e.target.value)} placeholder="Fail URL" />
            <span>Operator ID</span>
            <input type="text" value={operatorIdFilter} onChange={(e) => setOperatorIdFilter(e.target.value)} placeholder="Operator ID" />
          </div>
          <div className="filter-row"> 
            <span className="label-created-at">Created At</span>
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: '15px',  width: '200px' }}>
                <DatePicker
                  selected={createdAtFrom}
                  onChange={(date) => setCreatedAtFrom(date)}
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
                  onChange={(date) => setCreatedAtTo(date)}
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
    <div className="button-filter">
      <button className="filter" onClick={handleApplyFilters}>Применить фильтры</button>
    </div>

    <div className="button-export">
      <button className="export" onClick={() => exportToExcel(data)}>Excel</button>
    </div>
  </div>

  <div className="pagination">
    <button onClick={handlePreviousPage} disabled={page === 1 || loading}>◀</button>
    <span> {page}</span>
    <button onClick={handleNextPage} disabled={loading}>►</button>
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
                <th>Is Test</th>
                <th>Acquirer ID</th>
                <th>Bank ID</th>
                <th>Mask PAN From</th>
                <th>Mask PAN To</th>
                <th>Updated At</th>
                <th>Merchant ID</th>
                <th>Status</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>User Commission</th>
                <th>Bank Commission</th>
                <th>IP</th>
                <th>Created At</th>
                <th>Reference ID</th>
                <th>User ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Return URL</th>
                <th>Back URL</th>
                <th>Fail URL</th>
                <th>Operator ID</th>
              </tr>
            </thead>
            {/* Данные */}
            <tbody>
              {data.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item.id)}>
                  <td>{item.id}</td>
                  <td>{item.is_test.toString()}</td>
                  <td>{item.acquirer_id}</td>
                  <td>{item.bank_id}</td>
                  <td>{item.mask_pan_from}</td>
                  <td>{item.mask_pan_to}</td>
                  <td>{formatDateTime(item.updated_at)}</td> {/* Форматируем дату и время */}
                  <td>{item.merchant_id}</td>
                  <td>{getStatusLabel(item.status)}</td>
                  <td>{getTypeLabel(item.type)}</td>
                  <td>{item.amount}</td>
                  <td>{item.description}</td>
                  <td>{item.user_commission}</td>
                  <td>{item.bank_commission}</td>
                  <td>{item.ip}</td>
                  <td>{formatDateTime(item.created_at)}</td> {/* Форматируем дату и время */}
                  <td>{item.reference_id}</td>
                  <td>{item.user_id}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.return_url}</td>
                  <td>{item.back_url}</td>
                  <td>{item.fail_url}</td>
                  <td>{item.operator_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length > 0 && (
            <div className="modal" style={modalStyle}>
              <button className='close' variant="secondary" onClick={() => setLogs('')}>Закрыть</button>
              <h3 className='modaltable'>Логи платежа</h3>
              <table>
                <thead>
                  <tr className='width'>
                    {tableHeaders.map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className='width'>{log.id}</td>
                      <td className='width'>{log.type}</td>
                      <td className='width'>{log.p2p_transaction_id}</td>
                      <td className='width'>{log.request}</td>
                      <td className='width'>{log.response}</td>
                      <td className='width'>{log.created_at}</td>
                      <td className='width'>{log.updated_at}</td>
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

export default P2P;
