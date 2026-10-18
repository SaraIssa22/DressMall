import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authorizedAdminEmail: string;
}

const AUTHORIZED_ADMIN_EMAIL = 'saraissa265@gmail.com';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  authError: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userEmail = (user.email || '').toLowerCase().trim();
          if (userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
            setIsAdmin(true);
          } else {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          }
        } catch (err) {
          console.warn('Error checking admin role in Firestore:', err);
          setIsAdmin(user.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase());
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userEmail = (user.email || '').toLowerCase().trim();
      
      if (userEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      } else {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err.message || 'فشل تسجيل الدخول عبر حساب Google');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        authError,
        loginWithGoogle,
        logout,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
