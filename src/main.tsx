import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './styles.css';
import App from './App';

addLocale('pt-BR', {
  firstDayOfWeek: 0,
  dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sem'
});
locale('pt-BR');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'filled' }}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
