import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import * as XLSX from 'xlsx';

const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data); // Преобразуем массив данных в формат для Excel

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tranzex');

  // Указываем имя файла и формат
  const excelFileName = 'tranzex.xlsx';

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
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Месяц от 0 до 11, поэтому +1
  const day = ('0' + date.getDate()).slice(-2); // День месяца

  return `${year}-${month}-${day}`;
};

function CashPayments() {
  const [data, setData] = useState([]); 
  const [id, setId] = useState('');
  const [isTest, setIsTest] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [userId, setUserId] = useState('');
  const [ip, setIp] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [lang, setLang] = useState('');
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [bonus, setBonus] = useState('');
  const [logs, setLogs] = useState('');
  const [createdAtFrom, setCreatedAtFrom] = useState(null);
  const [createdAtTo, setCreatedAtTo] = useState(null);
  const [page, setPage] = useState(1); // Текущее состояние страницы
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const limit = 100; // Лимит транзакций на страницу
  


  const getTypeLabel = (type) => {
    switch (type) {
      case 0:
        return 'Прием Карта';
      case 1:
        return 'Вывод Карта';
      case 2:
        return 'Прием ТЕЛ';
      case 3:
        return 'Вывод ТЕЛ';
      case 4:
        return 'Прием Счет';
      case 5:
        return 'Вывод Счет';  
      case 6:
        return 'Прием Cross-Currency';     
      case 7:
        return 'Вывод Cross-Currency';  
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

  const tableHeaders = ["ID", "Type", "Cash ID", "Request", "Response", "Created At", "Updated At"];

  const handleRowClick = async (id) => {
    try {
      const response = await axios.post('https://api.safepay.kg/admin/cash-payment/cash-payments/logs', { id });
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
      id: id ? parseInt(id) : undefined,
      is_test: isTest ? parseInt(isTest) : undefined,
      merchant_id: merchantId ? parseInt(merchantId) : undefined,
      reference_id: referenceId ? parseInt(referenceId) : undefined,
      user_id: userId ? parseInt(userId) : undefined,
      ip: ip || undefined,
      type: type ? parseInt(type) : undefined,
      status: status ? parseInt(status) : undefined,
      amount: amount ? parseFloat(amount) : undefined,
      currency: currency || undefined,
      lang: lang || undefined,
      created_at: createdAt ? formatDate(createdAt) : undefined,
      updated_at: updatedAt ? formatDate(updatedAt) : undefined,
      bonus: bonus ? parseInt(bonus) : undefined,
      date_range: dateRange,
    };
  
    try {
      const response = await axios.post('https://api.safepaypay.kz/admin/cash-payment/get-cash-payments', filters);
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
  }, [page,id,isTest,merchantId,referenceId,userId,ip,type,status,amount,currency,lang,createdAt,updatedAt,bonus,createdAtFrom,createdAtTo]);
  
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
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" /> 
            <span>Is Test</span>
            <input type="text" value={isTest} onChange={(e) => setIsTest(e.target.value)} placeholder="Is Test" />  
            <span>Merchant ID</span>
            <input type="text" value={merchantId} onChange={(e) => setMerchantId(e.target.value)} placeholder="Merchant ID" /> 
          </div>
          <div className="filter-row">
            <span>User ID</span>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
            <span>Status</span>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />   
            <span>Type</span>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
          </div> 
          <div className="filter-row"> 
            <span>Lang</span>
            <input type="text" value={lang} onChange={(e) => setLang(e.target.value)} placeholder="Lang" />  
            <span>Amount</span>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <span>Bonus</span>
            <input type="text" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="Bonus" />
          </div>
          <div className="filter-row">   
            <span>Reference ID</span>
            <input type="text" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="Reference ID" />   
            <span>Currency</span>
            <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Currency" /> 
            <span>IP</span>
            <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP" />
          </div>
          <div className="filter-row">   
            <span>Created At</span>
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
    <button className="filter" onClick={handleApplyFilters}>Применить фильтры</button>
    <button className="export" onClick={() => exportToExcel(data)}>Excel</button>
  </div>

  <div className="pagination">
    <button onClick={handlePreviousPage} disabled={page === 1 || loading}>◀</button>
    <span>{page}</span>
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
                  <th>Merchant ID</th>
                  <th>Reference ID</th>
                  <th>Acquirer ID</th>
                  <th>Bank ID</th>
                  <th>User ID</th>
                  <th>Try</th>
                  <th>IP</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Lang</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Bonus</th>
                </tr>
            </thead>
            {/* Данные */}
            <tbody>
            {data.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item.id)}>
                  <td>{item.id}</td>
                  <td>{item.is_test ? 'Да' : 'Нет'}</td>
                  <td>{item.merchant_id}</td>
                  <td>{item.reference_id}</td>
                  <td>{item.acquirer_id}</td>
                  <td>{item.bank_id}</td>
                  <td>{item.user_id}</td>
                  <td>{item.try}</td>
                  <td>{item.ip}</td>
                  <td>{getTypeLabel(item.type)}</td>
                  <td>{getStatusLabel(item.status)}</td>
                  <td>{item.amount}</td>
                  <td>{item.currency}</td>
                  <td>{item.lang}</td>
                  <td>{formatDateTime(item.created_at)}</td> {/* Форматируем дату и время */}
                  <td>{formatDateTime(item.updated_at)}</td> {/* Форматируем дату и время */}
                  <td>{item.bonus}</td>
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
                      <td className='width'>{log.cash_id}</td>
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

export default CashPayments;
