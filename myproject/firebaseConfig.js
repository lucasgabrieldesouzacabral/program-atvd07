import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCDoNpLYlBgahhMTDqiDvcszPhfId64auA',
  authDomain: 'programatvd07.firebaseapp.com',
  projectId: 'programatvd07',
  storageBucket: 'programatvd07.firebasestorage.app',
  messagingSenderId: '103040265691',
  appId: '1:103040265691:web:01f9d652abd4b433928bfe',
  measurementId: 'G-1DJ842XRNF',
};

// Inicializa o app Firebase uma vez e permite que getAuth() use o app padrão.
initializeApp(firebaseConfig);