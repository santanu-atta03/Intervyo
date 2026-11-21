
test('renders login button and handles click', async () => {
  const onLogin = jest.fn();
  const { getByText } = render(<AuthenticationButtons onLogin={onLogin} onLogout={() => {}} />);
  fireEvent.click(getByText('Login'));
  fireEvent.click(getByText('Logout'));
  fireEvent.click(getByText('Login'));
  expect(onLogin).toHaveBeenCalledTimes(1);
});

test('renders logout button and handles click', async () => {
  const onLogout = jest.fn();
  const { getByText } = render(<AuthenticationButtons onLogin={() => {}} onLogout={onLogout} />);
  fireEvent.click(getByText('Logout'));
  expect(onLogout).toHaveBeenCalledTimes(1);
});


