'use client';

import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">MemeVerse</h1>
      <ThemeToggle />
    </header>
  );
}