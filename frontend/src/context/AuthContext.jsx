import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: 'user_default',
    name: 'Ministério de Louvor AD Guará',
    email: 'louvor@adguaratingueta.com.br',
    churchName: 'AD Guaratinguetá — Templo Sede',
    role: 'Líder de Louvor',
  });

  const [plan, setPlan] = useState(() => {
    return localStorage.getItem('cantaflow_plan') || 'free';
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cantaflow_plan', plan);
  }, [plan]);

  const switchPlan = async (newPlan) => {
    try {
      await api.togglePlan(newPlan);
      setPlan(newPlan);
      if (newPlan === 'pro') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'],
        });
      }
    } catch (err) {
      setPlan(newPlan);
    }
  };

  const isPro = plan === 'pro';

  return (
    <AuthContext.Provider
      value={{
        user,
        plan,
        isPro,
        switchPlan,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
