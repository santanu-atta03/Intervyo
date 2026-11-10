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
