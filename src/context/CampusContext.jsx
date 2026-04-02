import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCollegeById, getCurrentUser } from '../data/campusArenaData';

const CampusContext = createContext();

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};

export const CampusProvider = ({ children }) => {
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCollege = localStorage.getItem('selectedCollege');
      const savedUser = localStorage.getItem('currentUser');
      const savedVerified = localStorage.getItem('isVerified');

      if (savedCollege) {
        setSelectedCollege(JSON.parse(savedCollege));
      }
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Set default user
        const defaultUser = getCurrentUser();
        setCurrentUser(defaultUser);
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
      }
      if (savedVerified) {
        setIsVerified(JSON.parse(savedVerified));
      }
    } catch (error) {
      console.error('Error loading campus data from localStorage:', error);
      // Fallback to default user
      const defaultUser = getCurrentUser();
      setCurrentUser(defaultUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectCollege = (collegeId) => {
    const college = getCollegeById(collegeId);
    if (college) {
      setSelectedCollege(college);
      localStorage.setItem('selectedCollege', JSON.stringify(college));
    }
  };

  const updateVerification = (verified) => {
    setIsVerified(verified);
    localStorage.setItem('isVerified', JSON.stringify(verified));
  };

  const switchCollege = (collegeId) => {
    selectCollege(collegeId);
    // Reset verification when switching colleges
    updateVerification(false);
  };

  const value = {
    selectedCollege,
    currentUser,
    isVerified,
    isLoading,
    selectCollege,
    updateVerification,
    switchCollege,
    hasCollege: !!selectedCollege
  };

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  );
};