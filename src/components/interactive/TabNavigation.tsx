import { useEffect, useState } from 'react';

interface Props {
  currentPath?: string;
}

export default function TabNavigation({ currentPath: initialPath }: Props) {
  const [currentPath, setCurrentPath] = useState(initialPath || '/');

  // Update current path on client-side navigation
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const tabs = [
    { label: 'Portfolio', href: '/' },
    { label: 'Articles', href: '/articles' }
  ];

  return (
    <nav className="tab-navigation">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.href;
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`tab-button ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
