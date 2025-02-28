import '@/styles/globals.css';
// import ThemeWrapper from '@/components/ThemeWrapper';
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