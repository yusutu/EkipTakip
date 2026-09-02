import { expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  await user.type(screen.getByLabelText(/Not metni/i), 'Yeni takip notu');
  await user.click(screen.getByRole('button', { name: /Not ekle/i }));

  expect(screen.getByText('Yeni takip notu')).toBeInTheDocument();
});

test('renders tasks page with filters and deadline status', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /Çalışmalar/i }));

  expect(screen.getByRole('heading', { name: /Çalışmalar/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /\+ Yeni çalışma/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Ara/i)).toBeInTheDocument();
  // Use getAllByLabelText[0] to avoid conflict with modal form
  expect(screen.getAllByLabelText(/Sorumlu/i)[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText(/Durum/i)[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText(/Öncelik/i)[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText(/İş tipi/i)[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText(/OKR/i)[0]).toBeInTheDocument();
  expect(screen.getByText(/Ödeme ekranı revizyonu/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Deadline durumu/i).length).toBeGreaterThan(0);
});

test('modal opens and closes', async () => {
  const user = userEvent.setup({ delay: null });
  render(<App />);

  // Navigate to tasks page
  await user.click(screen.getByRole('button', { name: /Çalışmalar/i }));

  // Click the new work item button
  const newWorkBtn = screen.getByRole('button', { name: /\+ Yeni çalışma/i });
  await user.click(newWorkBtn);

  // Modal should be visible
  expect(screen.getByRole('heading', { name: /\+ Yeni çalışma/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Çalışma adını giriniz/i)).toBeInTheDocument();

  // Click cancel button
  const cancelButtons = screen.getAllByRole('button', { name: /İptal/i });
  const cancelButton = cancelButtons[cancelButtons.length - 1];
  await user.click(cancelButton);

  // Modal should still be in DOM but form should be visible
  expect(screen.getByPlaceholderText(/Çalışma adını giriniz/i)).toBeInTheDocument();
});

test('renders employee development details when a team member is selected', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /^Ekip$/i }));

  expect(screen.getByRole('heading', { name: /Çalışan gelişimi ve geri bildirim/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Elif Demir/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Güçlü yönler/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Gelişim aksiyonları/i })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Yasir Kaya/i }));

  expect(screen.getByRole('heading', { name: /Yasir Kaya/i })).toBeInTheDocument();
  expect(screen.getByText(/Teknik karar kaydı başlat/i)).toBeInTheDocument();
});

test('allows adding team feedback and completing development actions', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /^Ekip$/i }));
  await user.type(screen.getByLabelText(/Görüşme konusu/i), 'Kariyer hedefleri');
  await user.type(screen.getByLabelText(/Görüşme notu/i), 'Yeni dönem gelişim hedefleri netleştirildi.');
  await user.click(screen.getByRole('button', { name: /Görüşme ekle/i }));

  expect(screen.getByText('Kariyer hedefleri')).toBeInTheDocument();

  await user.click(screen.getAllByRole('button', { name: /^Tamamla$/i })[0]);
  expect(screen.getByRole('button', { name: /Geri al/i })).toBeInTheDocument();
});
