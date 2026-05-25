import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  return { loading };
};

export const useAdminRoute = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return { loading };
};

export const useMentorRoute = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role !== 'MENTOR') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return { loading };
};

export const useStudentRoute = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role !== 'STUDENT') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return { loading };
};
