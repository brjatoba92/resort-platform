import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useEventNotifications } from '../../../hooks';

// Call useEventNotifications outside of the component to avoid React Hooks rule violation
const useNotifications = () => {
  useEventNotifications();
};

export default function Layout() {
  useNotifications();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}