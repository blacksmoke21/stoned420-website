// ThemeToggle.jsx
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-4 right-4 p-2 rounded bg-gray-700 text-white dark:bg-gray-200 dark:text-black"
    >
      Toggle Dark
    </button>
  );
};

export default ThemeToggle;
