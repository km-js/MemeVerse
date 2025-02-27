import '@/styles/globals.css';
import ThemeWrapper from '@/components/ThemeWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}