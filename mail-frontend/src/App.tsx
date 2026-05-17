import { useState, useEffect, useMemo } from 'react';
import LandingPage from './LandingPage';
import CategoryPage from './CategoryPage';
import EmailPage from './EmailPage';
import SuccessPage from './SuccessPage';
import UnsubscribePage from './UnsubscribePage';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8001';

type Route = 'landing' | 'categories' | 'email' | 'success';

function hashToRoute(hash: string): Route {
  if (hash === '#/categories') return 'categories';
  if (hash === '#/email') return 'email';
  if (hash === '#/success') return 'success';
  return 'landing';
}

export default function App() {
  const unsubscribeToken = useMemo(
    () => new URLSearchParams(window.location.search).get('unsubscribe'),
    []
  );

  const [route, setRoute] = useState<Route>(() => hashToRoute(window.location.hash));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const onHashChange = () => setRoute(hashToRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r === 'landing' ? '/' : `/${r}`;
  };

  if (unsubscribeToken) {
    return (
      <div className="app-container">
        <div className="page-inner">
          <UnsubscribePage apiBase={API_BASE} token={unsubscribeToken} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {route === 'landing' && (
        <LandingPage onStart={() => navigate('categories')} />
      )}
      {route === 'categories' && (
        <CategoryPage
          selected={selectedCategories}
          onChange={setSelectedCategories}
          onBack={() => navigate('landing')}
          onNext={() => navigate('email')}
        />
      )}
      {route === 'email' && (
        <EmailPage
          apiBase={API_BASE}
          categories={selectedCategories}
          onBack={() => navigate('categories')}
          onSuccess={() => navigate('success')}
        />
      )}
      {route === 'success' && (
        <SuccessPage onReset={() => navigate('landing')} />
      )}
    </div>
  );
}
