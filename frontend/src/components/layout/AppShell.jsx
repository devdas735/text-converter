import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import HeaderNavbar from './HeaderNavbar.jsx';
import Sidebar from './Sidebar.jsx';

function AppShell() {
  return (
    <div className="min-h-screen">
      <HeaderNavbar />
      <main className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 md:px-6">
        <Sidebar />
        <section className="surface-card w-full p-5 md:p-6">
          <Outlet />
        </section>
      </main>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <Footer />
      </div>
    </div>
  );
}

export default AppShell;
