import { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  ArrowRightLeft, 
  PlusCircle, 
  History, 
  Undo2, 
  User, 
  MapPin, 
  CreditCard,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BankSystem } from './core/BankSystem';
import { BankController } from './core/BankController';
import { WebBankUI } from './ui/WebBankUI';
import { Client } from './core/models/Client';
import { Account } from './core/models/Account';
import { ITransaction } from './core/models/Transaction';
import { TransactionType } from './core/models/Transaction';

// --- Types ---
type RegistrationStep = 'name' | 'address' | 'passport' | 'complete';

// --- Main Component ---
export default function App() {
  // System State
  const bankSystem = useMemo(() => BankSystem.getInstance(), []);
  const [controller, setController] = useState<BankController | null>(null);
  
  // App State
  const [client, setClient] = useState<Client | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Form States
  const [regStep, setRegStep] = useState<RegistrationStep>('name');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    passport: ''
  });
  
  const [transferData, setTransferData] = useState({ targetId: '', amount: '' });
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

  // Initialize UI Bridge
  useEffect(() => {
    const ui = new WebBankUI(
      setBalance,
      setAccounts,
      setTransactions,
      (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
      }
    );
    const ctrl = new BankController(ui, bankSystem);
    setController(ctrl);
  }, [bankSystem]);

  // Handle account switching
  useEffect(() => {
    if (controller && currentAccount) {
      controller.setAccount(currentAccount);
    }
  }, [currentAccount, controller]);

  // Registration Actions
  const handleNextStep = () => {
    if (regStep === 'name') {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setNotification({ msg: 'Заполните имя и фамилию', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      setRegStep('address');
    } else if (regStep === 'address') {
      if (!formData.address.trim()) {
        setNotification({ msg: 'Введите адрес или нажмите Пропустить', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      setRegStep('passport');
    } else if (regStep === 'passport') {
      if (!formData.passport.trim()) {
        setNotification({ msg: 'Введите паспорт или нажмите Пропустить', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      finishRegistration();
    }
  };

  const skipStep = () => {
    if (regStep === 'address') {
      setRegStep('passport');
    } else if (regStep === 'passport') {
      finishRegistration();
    }
  };

  const finishRegistration = () => {
    const newClient = bankSystem.createClient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address || undefined,
      passport: formData.passport || undefined
    });
    setClient(newClient);
    if (controller) {
      controller.setClient(newClient);
      controller.refreshUI();
    }
    setRegStep('complete');
  };

  const handlePassportChange = (val: string) => {
    // Разрешаем только цифры
    const onlyNums = val.replace(/[^0-9]/g, '');
    setFormData({ ...formData, passport: onlyNums });
  };



  const handleOpenAccount = (type: 'debit' | 'deposit' | 'credit') => {
    if (client && controller) {
      const newAcc = bankSystem.createAccount(type, client);
      setCurrentAccount(newAcc);
      controller.refreshUI();
      setShowNewAccountModal(false);
    }
  };

  // UI Helpers
  const isDoubtful = client?.isDoubtful;

  // Render Registration
  if (regStep !== 'complete') {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-[#002D72] p-8 text-white text-center flex flex-col items-center">
            <img 
              src="https://storage.googleapis.com/mle-it-sandbox-public-assets/eb78b273-ed83-4a11-8ec1-7973ee203bc8.png" 
              alt="Vadim-Bank Logo" 
              className="w-20 h-20 rounded-full border-4 border-blue-400 object-cover shadow-2xl mb-4 bg-white"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Vadim+Bank&background=002D72&color=fff&size=128";
              }}
            />
            <h1 className="text-3xl font-bold mb-1 uppercase tracking-wider">Vadim-Bank</h1>
            <p className="text-sm opacity-80">Добро пожаловать в будущее банкинга</p>
          </div>
          
          <div className="p-8">
            {/* Step Indicator */}
            <div className="flex justify-between mb-8">
              {['Имя', 'Адрес', 'Паспорт'].map((s, idx) => {
                const steps: RegistrationStep[] = ['name', 'address', 'passport'];
                const active = steps.indexOf(regStep) >= idx;
                return (
                  <div key={s} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${active ? 'bg-[#002D72] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-xs ${active ? 'text-[#002D72] font-semibold' : 'text-gray-400'}`}>{s}</span>
                  </div>
                );
              })}
            </div>

            {regStep === 'name' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002D72] focus:border-transparent"
                    placeholder="Иван"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002D72] focus:border-transparent"
                    placeholder="Иванов"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
            )}

            {regStep === 'address' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адрес проживания (необязательно)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002D72] focus:border-transparent"
                    placeholder="г. Москва, ул. Ленина, д. 1"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <p className="text-xs text-amber-600 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5" />
                  Без адреса счет будет "сомнительным" с лимитом операций 50 000 ₽
                </p>
              </div>
            )}

            {regStep === 'passport' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Паспортные данные (необязательно)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002D72] focus:border-transparent"
                    placeholder="Только цифры"
                    value={formData.passport}
                    onChange={e => handlePassportChange(e.target.value)}
                  />
                </div>
                <p className="text-xs text-amber-600 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5" />
                  Без паспортных данных счет останется сомнительным
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {(regStep === 'address' || regStep === 'passport') && (
                <button 
                  onClick={skipStep}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Пропустить
                </button>
              )}
              <button 
                onClick={handleNextStep}
                disabled={regStep === 'name' && (!formData.firstName || !formData.lastName)}
                className="flex-1 py-3 px-4 bg-[#002D72] text-white rounded-xl font-semibold hover:bg-[#001D4A] transition-colors disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-12">
      {/* Header */}
      <header className="bg-[#002D72] text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://storage.googleapis.com/mle-it-sandbox-public-assets/eb78b273-ed83-4a11-8ec1-7973ee203bc8.png" 
              alt="Vadim-Bank Logo" 
              className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover shadow-lg bg-white"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=VB&background=002D72&color=fff";
              }}
            />
            <span className="text-xl font-bold tracking-tight uppercase">Vadim-Bank</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{client?.firstName} {client?.lastName}</p>
              {isDoubtful && <span className="text-[10px] bg-amber-500 px-1.5 py-0.5 rounded uppercase font-bold text-[#002D72]">Сомнительный счет</span>}
            </div>
            <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center border border-blue-400">
              <User size={20} />
            </div>
            <button onClick={() => window.location.reload()} className="p-2 hover:bg-blue-800 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          <span className="font-medium">{notification.msg}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Accounts & Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Balance Card */}
          {!currentAccount ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 shadow-sm">
              <PlusCircle size={48} className="text-[#002D72] mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">У вас пока нет активных счетов</h3>
              <p className="text-sm text-slate-500 mb-6">Чтобы начать операции, откройте дебетовый, кредитный или депозитный счет.</p>
              <button 
                onClick={() => setShowNewAccountModal(true)}
                className="bg-[#002D72] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors"
              >
                Открыть счет
              </button>
            </div>
          ) : (
            <div className="bg-[#002D72] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="relative z-1">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-blue-200 text-sm mb-1">Текущий счет ({currentAccount?.getType()})</p>
                    <p className="text-2xl font-mono tracking-widest">{currentAccount?.id.replace(/(\d{4})/g, '$1 ')}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                    <CreditCard size={24} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-blue-200 text-xs mb-1 uppercase tracking-wider font-semibold">Баланс</p>
                    <h2 className="text-5xl font-bold">{balance.toLocaleString()} ₽</h2>
                  </div>
                  {isDoubtful && (
                    <div className="bg-amber-400 text-[#002D72] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                      <AlertTriangle size={14} />
                      Лимит операций: 50 000 ₽
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transfer */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
              <div className="w-10 h-10 bg-blue-100 text-[#002D72] rounded-full flex items-center justify-center mb-4">
                <ArrowRightLeft size={20} />
              </div>
              <h3 className="font-bold mb-4">Перевод</h3>
                <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Номер счета" 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 pr-20"
                    value={transferData.targetId}
                    onChange={e => setTransferData({...transferData, targetId: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setTransferData({...transferData, targetId: '1111 1111 1111 1111'})}
                    className="absolute right-1 top-1 bottom-1 px-2 text-[10px] bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-bold"
                  >
                    ТЕСТ-ID
                  </button>
                </div>
                
                {accounts.length > 1 && (
                  <select 
                    className="w-full px-3 py-2 text-[10px] border border-gray-100 rounded-lg bg-gray-50 text-gray-500 outline-none"
                    onChange={(e) => setTransferData({...transferData, targetId: e.target.value})}
                    value={transferData.targetId}
                  >
                    <option value="">Между своими счетами...</option>
                    {accounts.filter(a => a.id !== currentAccount?.id).map(a => (
                      <option key={a.id} value={a.id}>{a.getType()} (*{a.id.slice(-4)})</option>
                    ))}
                  </select>
                )}

                <input 
                  type="number" 
                  placeholder="Сумма" 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  value={transferData.amount}
                  onChange={e => setTransferData({...transferData, amount: e.target.value})}
                />
                <button 
                  disabled={!currentAccount}
                  onClick={() => {
                    const amount = Number(transferData.amount);
                    if (amount <= 0) return setNotification({ msg: 'Сумма должна быть > 0', type: 'error' });
                    if (!transferData.targetId.trim()) return setNotification({ msg: 'Введите номер счета', type: 'error' });
                    
                    const success = controller?.transfer(transferData.targetId.replace(/\s/g, ''), amount);
                    if (success) setTransferData({targetId: '', amount: ''});
                  }}
                  className="w-full bg-[#002D72] text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-30"
                >
                  Отправить
                </button>
              </div>
            </div>

            {/* Deposit */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4">
                <PlusCircle size={20} />
              </div>
              <h3 className="font-bold mb-4">Пополнение</h3>
              <div className="space-y-3">
                <input 
                  type="number" 
                  placeholder="Сумма пополнения" 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                />
                <button 
                  disabled={!currentAccount}
                  onClick={() => {
                    const amount = Number(depositAmount);
                    if (amount <= 0) return setNotification({ msg: 'Сумма должна быть > 0', type: 'error' });
                    const success = controller?.deposit(amount);
                    if (success) setDepositAmount('');
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-30"
                >
                  Пополнить
                </button>
              </div>
            </div>

            {/* Withdraw */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50">
              <div className="w-10 h-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4">
                <Wallet size={20} />
              </div>
              <h3 className="font-bold mb-4">Снятие</h3>
              <div className="space-y-3">
                <input 
                  type="number" 
                  placeholder="Сумма снятия" 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
                <button 
                  disabled={!currentAccount}
                  onClick={() => {
                    const amount = Number(withdrawAmount);
                    if (amount <= 0) return setNotification({ msg: 'Сумма должна быть > 0', type: 'error' });
                    const success = controller?.withdraw(amount);
                    if (success) setWithdrawAmount('');
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-30"
                >
                  Снять наличные
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="text-[#002D72]" size={20} />
                <h3 className="font-bold">История операций</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-400 italic">Транзакций пока нет</div>
              ) : (
                transactions.slice().reverse().map(tx => (
                  <div key={tx.id} className={`p-6 flex items-center justify-between transition-colors ${tx.status === 'undone' ? 'opacity-40 grayscale' : 'hover:bg-blue-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === TransactionType.Deposit ? 'bg-green-100 text-green-700' : 
                        tx.type === TransactionType.Withdraw ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {tx.type === TransactionType.Deposit ? <PlusCircle size={18} /> : 
                         tx.type === TransactionType.Withdraw ? <Wallet size={18} /> : <ArrowRightLeft size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{tx.type}</p>
                        <p className="text-xs text-gray-400">{tx.date.toLocaleString()}</p>
                        {tx.type === TransactionType.Transfer && <p className="text-[10px] text-blue-500 font-mono">ID: {tx.targetId}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === TransactionType.Deposit ? 'text-green-600' : 'text-gray-800'}`}>
                          {tx.type === TransactionType.Deposit ? '+' : '-'}{tx.amount.toLocaleString()} ₽
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${tx.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {tx.status === 'active' ? 'Выполнено' : 'Отменено'}
                        </span>
                      </div>
                      {tx.status === 'active' && (
                        <button 
                          onClick={() => controller?.undo(tx.id)}
                          title="Отменить транзакцию"
                          className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          <Undo2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Account Selection & Management */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#002D72]" />
                Мои счета
              </h3>
              <button 
                onClick={() => setShowNewAccountModal(true)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <PlusCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {accounts.map(acc => (
                <button 
                  key={acc.id}
                  onClick={() => setCurrentAccount(acc)}
                  className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${
                    currentAccount?.id === acc.id 
                    ? 'border-[#002D72] bg-blue-50 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      acc.getType() === 'Дебетовый' ? 'bg-blue-200 text-[#002D72]' :
                      acc.getType() === 'Кредитный' ? 'bg-purple-200 text-purple-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      {acc.getType()}
                    </span>
                    <span className="font-mono text-xs text-gray-400">*{acc.id.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="font-bold text-lg text-[#002D72]">{acc.balance.toLocaleString()} ₽</p>
                    <ChevronRight size={16} className={currentAccount?.id === acc.id ? 'text-[#002D72]' : 'text-gray-300'} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
             <h3 className="font-bold mb-4 flex items-center gap-2">
               <User size={18} className="text-[#002D72]" />
               Профиль клиента
             </h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">ФИО</p>
                    <p className="font-medium">{client?.firstName} {client?.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <MapPin size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Адрес</p>
                    <p className={`font-medium ${!client?.address ? 'text-amber-500 italic' : ''}`}>
                      {client?.address || 'Не указан'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Паспорт</p>
                    <p className={`font-medium ${!client?.passport ? 'text-amber-500 italic' : ''}`}>
                      {client?.passport || 'Не указан'}
                    </p>
                  </div>
                </div>
                {isDoubtful ? (
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-xs text-amber-800 leading-relaxed mb-3">
                      <strong>Ограничения:</strong> Для снятия ограничений и повышения лимитов (свыше 50 000 ₽), пожалуйста, заполните профиль полностью.
                    </p>
                    <button 
                      onClick={() => setShowProfileUpdateModal(true)}
                      className="w-full py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors uppercase tracking-wider"
                    >
                      Подтвердить личность
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                     <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
                        <CheckCircle2 size={16} />
                        ЛИМИТЫ СНЯТЫ
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>
      </main>

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Открыть новый счет</h2>
                <button onClick={() => setShowNewAccountModal(false)} className="text-gray-400 hover:text-gray-600">
                   <XCircle size={28} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <button onClick={() => handleOpenAccount('debit')} className="p-6 border border-gray-100 rounded-2xl hover:border-[#002D72] hover:bg-blue-50 transition-all text-center group">
                    <div className="w-12 h-12 bg-blue-100 text-[#002D72] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Wallet size={24} />
                    </div>
                    <span className="font-bold text-sm">Дебетовый</span>
                    <p className="text-[10px] text-gray-400 mt-2">Без комиссий</p>
                 </button>
                 <button onClick={() => handleOpenAccount('deposit')} className="p-6 border border-gray-100 rounded-2xl hover:border-[#002D72] hover:bg-blue-50 transition-all text-center group">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <PlusCircle size={24} />
                    </div>
                    <span className="font-bold text-sm">Депозит</span>
                    <p className="text-[10px] text-gray-400 mt-2">Срок 1 год</p>
                 </button>
                 <button onClick={() => handleOpenAccount('credit')} className="p-6 border border-gray-100 rounded-2xl hover:border-[#002D72] hover:bg-blue-50 transition-all text-center group">
                    <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <CreditCard size={24} />
                    </div>
                    <span className="font-bold text-sm">Кредитный</span>
                    <p className="text-[10px] text-gray-400 mt-2">Лимит 100к</p>
                 </button>
               </div>
            </div>
         </div>
      )}

      {/* Profile Update Modal */}
      {showProfileUpdateModal && client && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Личные данные</h2>
                <button onClick={() => setShowProfileUpdateModal(false)} className="text-gray-400 hover:text-gray-600">
                   <XCircle size={28} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Адрес проживания</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Введите адрес..."
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Паспортные данные</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                      value={formData.passport}
                      onChange={e => setFormData({...formData, passport: e.target.value})}
                      placeholder="Серия и номер..."
                   />
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  * Поля необходимо заполнить для снятия лимитов "сомнительного счета".
                </p>
                <button 
                  onClick={() => {
                    client.updateAddress(formData.address);
                    client.updatePassport(formData.passport);
                    // Force React to re-render by updating client state with a new reference
                    setClient(Object.assign(Object.create(Object.getPrototypeOf(client)), client));
                    controller?.refreshUI();
                    setShowProfileUpdateModal(false);
                    setNotification({ msg: 'Данные профиля обновлены', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="w-full bg-[#002D72] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg"
                >
                  Сохранить
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
