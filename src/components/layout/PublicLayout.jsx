import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
