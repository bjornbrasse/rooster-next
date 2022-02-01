import { User } from '@prisma/client';
import * as React from 'react';
// import Auth, { AuthProperties } from '~/components/Auth';

type TAuthContext = {
  logout: () => void;
  user: User | null;
};

const AuthContext = React.createContext<TAuthContext>({
  logout() {},
  user: null,
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [authUser, setAuthUser] = React.useState(false);

  const closeAuth = () => {
    setIsOpen(false);
  };

  React.useEffect(() => {
    const user = await 
  },[])

  return (
    <AuthContext.Provider
      value={{
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
