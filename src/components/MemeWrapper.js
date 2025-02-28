'use client';

import { MemeProvider } from '@/contexts/MemeContext';

export default function MemeWrapper({ children }) {
  return <MemeProvider>{children}</MemeProvider>;
}