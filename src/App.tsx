import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuditStore } from './lib/store';
import Dashboard from './pages/Dashboard';
import AuditDetail from './pages/AuditDetail';
import CalendarPage from './pages/Calendar';

export default function App() {
  const loadAudits = useAuditStore((state) => state.loadAudits);

  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit/:id" element={<AuditDetail />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}
