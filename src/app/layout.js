import '@/styles/globals.css';
import MemeWrapper from '@/components/MemeWrapper';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <MemeWrapper>{children} <Toaster position="bottom-right" /></MemeWrapper>
      </body>
    </html>
  );
}