import { render, screen } from '@testing-library/react';
import App from './App';

test('renders KienCMS SnackFood storefront', () => {
  render(<App />);
  expect(screen.getByLabelText(/KienCMS.SnackFood/i)).toBeInTheDocument();
});
