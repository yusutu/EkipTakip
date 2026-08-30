import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders notes page with completed filter and completion metadata', async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText(/EkipTakip/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Notlarım/i })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Notlarım/i }));

  expect(screen.getByText(/Tarihi gelen notlar/i)).toBeInTheDocument();
  expect(screen.getByText(/Tüm notlar/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Tamamlananlar/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Not metni/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Takip tarihi/i)).toBeInTheDocument();

  const completeButtons = screen.getAllByRole('button', { name: /Tamamla/i });
  await user.click(completeButtons[0]);

  await user.click(screen.getByRole('button', { name: /Tamamlananlar/i }));

  const completedLabels = screen.getAllByText(/Tamamlandı/i);
  expect(completedLabels.length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Tamamlama tarihi:/i).length).toBeGreaterThan(0);
});

test('renders tasks page with filters and deadline status', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /Çalışmalar/i }));

  expect(screen.getByRole('heading', { name: /Çalışmalar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /\+ Yeni çalışma/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Ara/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Sorumlu/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Durum/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Öncelik/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/İş tipi/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/OKR/i)).toBeInTheDocument();
  expect(screen.getByText(/Ödeme ekranı revizyonu/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Deadline durumu/i).length).toBeGreaterThan(0);
});
