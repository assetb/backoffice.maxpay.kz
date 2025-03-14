import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
import * as XLSX from 'xlsx';

const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data); // Преобразуем массив данных в формат для Excel

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment');

  // Указываем имя файла и формат
  const excelFileName = 'payment.xlsx';

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

function Payments() {
  const [data, setData] = useState([]); 
  const [id, setId] = useState('');
  const [isTest, setIsTest] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [acquirerId, setAcquirerId] = useState('');
  const [bankId, setBankId] = useState('');
  const [userId, setUserId] = useState('');
  const [tryFilter, setTryFilter] = useState('');
  const [ip, setIp] = useState('');
  const [trType, setTrType] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [maskedPan, setMaskedPan] = useState('');
  const [amount, setAmount] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [description, setDescription] = useState('');
  const [backUrl, setBackUrl] = useState('');
  const [requestUrl, setRequestUrl] = useState('');
  const [failUrl, setFailUrl] = useState('');
  const [bankCommission, setBankCommission] = useState('');
  const [merchantCommission, setMerchantCommission] = useState('');
  const [comment, setComment] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [currency, setCurrency] = useState('');
  const [originAmount, setOriginAmount] = useState('');
  const [rrn, setRrn] = useState('');
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

  const tableHeaders = ["ID", "Type", "Payment ID", "Request", "Response", "Created At", "Updated At"];

  const handleRowClick = async (id) => {
    try {
      const response = await axios.post('https://testapi.maxpay.kz/admin/payment/payments/logs', { id });
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
      is_test: isTest || undefined,
      merchant_id: merchantId ? parseInt(merchantId) : undefined,
      reference_id: referenceId || undefined,
      acquirer_id: acquirerId ? parseInt(acquirerId) : undefined,
      bank_id: bankId ? parseInt(bankId) : undefined,
      user_id: userId ? parseInt(userId) : undefined,
      try: tryFilter || undefined,
      ip: ip || undefined,
      tr_type: trType || undefined,
      type: type ? parseInt(type) : undefined,
      status: status ? parseInt(status) : undefined,
      masked_pan: maskedPan || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      refund_amount: refundAmount ? parseFloat(refundAmount) : undefined,
      refund_reason: refundReason || undefined,
      user_phone: userPhone || undefined,
      user_email: userEmail || undefined,
      description: description || undefined,
      back_url: backUrl || undefined,
      request_url: requestUrl || undefined,
      fail_url: failUrl || undefined,
      bank_commission: bankCommission ? parseFloat(bankCommission) : undefined,
      merchant_commission: merchantCommission ? parseFloat(merchantCommission) : undefined,
      comment: comment || undefined,
      finished_at: finishedAt || undefined,
      created_at: createdAt || undefined,
      updated_at: updatedAt || undefined,
      currency: currency || undefined,
      origin_amount: originAmount ? parseFloat(originAmount) : undefined,
      rrn: rrn || undefined,
      date_range: dateRange,
    };
   
    try {
      const response = await axios.post('https://testapi.maxpay.kz/admin/payment/get-payments', filters);
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
  }, [page, id, isTest, merchantId, referenceId, acquirerId, bankId, userId, tryFilter, ip, trType, type, status, maskedPan, amount, refundAmount, refundReason, userPhone, userEmail, description, backUrl, requestUrl, failUrl, bankCommission, merchantCommission, comment, finishedAt, createdAt, updatedAt, currency, originAmount, rrn, createdAtFrom, createdAtTo]);


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
            <span>Acquirer ID</span>
            <input type="text" value={acquirerId} onChange={(e) => setAcquirerId(e.target.value)} placeholder="Acquirer ID" /> 
            <span>Bank ID</span>
            <input type="text" value={bankId} onChange={(e) => setBankId(e.target.value)} placeholder="Bank ID" />
          </div>
          <div className="filter-row"> 
            <span>Merchant ID</span>
            <input type="text" value={merchantId} onChange={(e) => setMerchantId(e.target.value)} placeholder="Merchant ID" /> 
            <span>Status</span>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />   
            <span>Type</span>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
            <span>Amount</span>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
          </div>
          <div className="filter-row">   
            <span>Bank Commission</span>
            <input type="text" value={bankCommission} onChange={(e) => setBankCommission(e.target.value)} placeholder="Bank Commission" /> 
            <span>Merchant Commission</span>
            <input type="text" value={merchantCommission} onChange={(e) => setMerchantCommission(e.target.value)} placeholder="Merchant Commission" /> 
            <span>IP</span>
            <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP" />
            <span>Description</span>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <div className="filter-row">   
            <span>Reference ID</span>
            <input type="text" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder="Reference ID" />
            <span>User ID</span>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />  
            <span>Email</span>
            <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" />
            <span>Phone</span>
            <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="Phone" />
          </div>
          <div className="filter-row">   
            <span>Back URL</span>
            <input type="text" value={backUrl} onChange={(e) => setBackUrl(e.target.value)} placeholder="Back URL" />  
            <span>Request URL</span>
            <input type="text" value={requestUrl} onChange={(e) => setRequestUrl(e.target.value)} placeholder="Request URL" />
            <span>Fail URL</span>
            <input type="text" value={failUrl} onChange={(e) => setFailUrl(e.target.value)} placeholder="Fail URL" />
            <span>Comment</span>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment" />
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
                    <th>Tr Type</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Masked PAN</th>
                    <th>Amount</th>
                    <th>Refund Amount</th>
                    <th>Refund Reason</th>
                    <th>User Phone</th>
                    <th>User Email</th>
                    <th>Description</th>
                    <th>Back URL</th>
                    <th>Request URL</th>
                    <th>Fail URL</th>
                    <th>Bank Commission</th>
                    <th>Merchant Commission</th>
                    <th>Comment</th>
                    <th>Finished At</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Currency</th>
                    <th>Origin Amount</th>
                    <th>RRN</th>
                  </tr>
                </thead>
                {/* тело таблицы */}
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} onClick={() => handleRowClick(row.id)}>
                      <td>{row.id}</td>
                      <td>{row.is_test}</td>
                      <td>{row.merchant_id}</td>
                      <td>{row.reference_id}</td>
                      <td>{row.acquirer_id}</td>
                      <td>{row.bank_id}</td>
                      <td>{row.user_id}</td>
                      <td>{row.try}</td>
                      <td>{row.ip}</td>
                      <td>{row.tr_type}</td>
                      <td>{row.type}</td>
                      <td>{row.status}</td>
                      <td>{row.masked_pan}</td>
                      <td>{row.amount}</td>
                      <td>{row.refund_amount}</td>
                      <td>{row.refund_reason}</td>
                      <td>{row.user_phone}</td>
                      <td>{row.user_email}</td>
                      <td>{row.description}</td>
                      <td>{row.back_url}</td>
                      <td>{row.request_url}</td>
                      <td>{row.fail_url}</td>
                      <td>{row.bank_commission}</td>
                      <td>{row.merchant_commission}</td>
                      <td>{row.comment}</td>
                      <td>{row.finished_at}</td>
                      <td>{formatDateTime(row.created_at)}</td> {/* Форматируем дату и время */}
                      <td>{formatDateTime(row.updated_at)}</td> {/* Форматируем дату и время */}
                      <td>{row.currency}</td>
                      <td>{row.origin_amount}</td>
                      <td>{row.rrn}</td>
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
                      <td className='width'>{log.payment_id}</td>
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

export default Payments;
