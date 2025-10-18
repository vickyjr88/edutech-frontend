import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const UnsubscribePage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Unsubscribing...');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const response = await api.get(`/newsletter/unsubscribe/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('An error occurred while trying to unsubscribe. Please try again later.');
      }
    };

    if (token) {
      unsubscribe();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unsubscribe from our Newsletter</h1>
          <p>{message}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnsubscribePage;
