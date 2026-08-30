import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ekip takip dashboard', () => {
  render(<App />);

  expect(screen.getByText(/EkipTakip/i)).toBeInTheDocument();
  expect(screen.getByText(/Yapılacak işler/i)).toBeInTheDocument();
  expect(screen.getByText(/Takım etkinliği/i)).toBeInTheDocument();
});
