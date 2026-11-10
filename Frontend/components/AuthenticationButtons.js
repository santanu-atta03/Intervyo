  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    await onLogin();
    setIsLoading(false);
    setIsDisabled(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    await onLogout();
    setIsLoading(false);
    setIsDisabled(false);
  };

      <button onClick={handleLogin} disabled={isDisabled || isLoading}>Login</button>
      <button onClick={handleLogout} disabled={isDisabled || isLoading}>Logout</button>
    <div style={{ display: 'none' }}>
      {isLoading && <div>Loading...</div>}
    <div style={{ display: 'none' }}>
      {isLoading && <div>Loading...</div>}
    </div>
      {isLoading && <div>Loading...</div>}

const AuthenticationButtons = ({ onLogin, onLogout }) => {
  const { isLoading, isDisabled, login, logout } = useAuth();

  return (
    <div>
      <button onClick={handleLogin} disabled={isDisabled || isLoading}>Login</button>
      <button onClick={handleLogout} disabled={isDisabled || isLoading}>Logout</button>
    </div>
  );
};

export default AuthenticationButtons;

