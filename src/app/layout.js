import '@/styles/globals.css';
import MemeWrapper from '@/components/MemeWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MemeWrapper>{children}</MemeWrapper>
      </body>
    </html>
  );
}