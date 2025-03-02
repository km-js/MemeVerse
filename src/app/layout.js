import '@/styles/globals.css';
import MemeWrapper from '@/components/MemeWrapper';
import Header from '@/components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <MemeWrapper>{children}</MemeWrapper>
      </body>
    </html>
  );
}