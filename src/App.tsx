import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.location.href = '/auth.html';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}

export default App;
