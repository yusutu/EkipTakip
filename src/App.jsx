import { useMemo, useState } from 'react';
import './App.css';

const summaryCards = [
  { label: 'Aktif çalışma', value: '18', delta: '+6%', tone: 'blue' },
  { label: 'Geciken çalışma', value: '4', delta: '-1%', tone: 'amber' },
  { label: 'Riskli çalışma', value: '3', delta: '+2%', tone: 'red' },
];

const tasks = [
  { title: 'Ödeme ekranı revizyonu', owner: 'Elif', remaining: '6 gün kaldı', priority: 'Yüksek' },
  { title: 'Görev akışı optimizasyonu', owner: 'Yasir', remaining: '4 gün kaldı', priority: 'Orta' },
  { title: 'Kullanıcı raporları', owner: 'Berat', remaining: '2 gün kaldı', priority: 'Yüksek' },
  { title: 'İçerik yayın takvimi', owner: 'Fuat', remaining: '2 gün kaldı', priority: 'Düşük' },
];

const teamStatus = [
  { name: 'Elif', active: 4, status: 'Yoğun', late: 1 },
  { name: 'Yasir', active: 3, status: 'Dengeli', late: 0 },
  { name: 'Berat', active: 5, status: 'Yoğun', late: 2 },
  { name: 'Fuat', active: 2, status: 'Rahat', late: 0 },
  { name: 'Sefer', active: 4, status: 'Dengeli', late: 1 },
];

const initialNotes = [
  { id: 1, text: 'Müşteri geri bildirimleri için ödeme ekranı revizyonu öncelikli hale getirildi.', dueDate: '2026-08-25', completed: false, completedAt: null },
  { id: 2, text: 'Takım toplantısında mobil bildirim akışı için 2 iş günü eklendi.', dueDate: '2026-08-24', completed: false, completedAt: null },
  { id: 3, text: 'Riskli iş akışları için QA kontrol listesinin güncellenmesi istendi.', dueDate: '2026-08-28', completed: false, completedAt: null },
  { id: 4, text: 'Yatırım sonrası rapor için ekip kontrol listesi hazırlandı.', dueDate: '2026-08-20', completed: true, completedAt: '2026-08-21' },
];

const workItems = [
  { id: 1, name: 'Ödeme ekranı revizyonu', owner: 'Elif', type: 'Frontend', priority: 'Yüksek', okr: 'Müşteri memnuniyeti', deadline: '2026-08-24', status: 'Devam ediyor' },
  { id: 2, name: 'Mobil bildirim akışı', owner: 'Yasir', type: 'Mobil', priority: 'Orta', okr: 'Kullanıcı katılımı', deadline: '2026-08-30', status: 'Beklemede' },
  { id: 3, name: 'Kullanıcı raporları', owner: 'Berat', type: 'Analiz', priority: 'Yüksek', okr: 'Veri odaklı kararlar', deadline: '2026-08-21', status: 'Riskli' },
  { id: 4, name: 'İçerik yayın takvimi', owner: 'Fuat', type: 'Pazarlama', priority: 'Düşük', okr: 'Marka görünürlüğü', deadline: '2026-09-02', status: 'Devam ediyor' },
  { id: 5, name: 'Teslimat KPI analizi', owner: 'Sefer', type: 'Analiz', priority: 'Orta', okr: 'Operasyon verimliliği', deadline: '2026-08-18', status: 'Tamamlandı' },
];

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getTodayValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateDifference = (targetDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${targetDate}T00:00:00`);
  return Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [notes, setNotes] = useState(initialNotes);
  const [noteText, setNoteText] = useState('');
  const [noteDate, setNoteDate] = useState(getTodayValue());
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('Tümü');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [priorityFilter, setPriorityFilter] = useState('Tümü');
  const [typeFilter, setTypeFilter] = useState('Tümü');
  const [okrFilter, setOkrFilter] = useState('Tümü');

  const overdueNotes = useMemo(
    () => notes.filter((note) => !note.completed && getDateDifference(note.dueDate) <= 0),
    [notes]
  );

  const futureOpenNotes = useMemo(
    () => notes.filter((note) => !note.completed && getDateDifference(note.dueDate) > 0),
    [notes]
  );

  const completedNotes = useMemo(
    () => notes.filter((note) => note.completed),
    [notes]
  );

  const filteredWorkItems = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return workItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.owner.toLowerCase().includes(query) ||
        item.okr.toLowerCase().includes(query);
      const matchesOwner = ownerFilter === 'Tümü' || item.owner === ownerFilter;
      const matchesStatus = statusFilter === 'Tümü' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'Tümü' || item.priority === priorityFilter;
      const matchesType = typeFilter === 'Tümü' || item.type === typeFilter;
      const matchesOkr = okrFilter === 'Tümü' || item.okr === okrFilter;

      return matchesSearch && matchesOwner && matchesStatus && matchesPriority && matchesType && matchesOkr;
    });
  }, [searchTerm, ownerFilter, statusFilter, priorityFilter, typeFilter, okrFilter]);

  const addNote = () => {
    if (!noteText.trim()) return;

    setNotes((currentNotes) => [
      {
        id: Date.now(),
        text: noteText.trim(),
        dueDate: noteDate,
        completed: false,
        completedAt: null,
      },
      ...currentNotes,
    ]);
    setNoteText('');
    setNoteDate(getTodayValue());
  };

  const completeNote = (id) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id && !note.completed
          ? { ...note, completed: true, completedAt: getTodayValue() }
          : note
      )
    );
  };

  const renderDashboard = () => (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Merhaba, Gökhan</p>
          <h2>İş yönetimi görünümü</h2>
        </div>
        <div className="topbar-actions">
          <button className="ghost-btn">Filtrele</button>
          <button className="primary-btn">+ Yeni görev</button>
        </div>
      </header>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className={`summary-card ${card.tone}`}>
            <div className="card-topline">
              <span>{card.label}</span>
              <span className="chip">{card.delta}</span>
            </div>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel tasks-panel">
          <div className="panel-header">
            <h3>Dikkat gerektiren işler</h3>
            <button className="link-btn">Tümünü gör</button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.title} className="task-item task-item-compact">
                <div className="task-main">
                  <p className="task-title">{task.title}</p>
                  <div className="task-meta">
                    <span>{task.owner}</span>
                    <span>{task.remaining}</span>
                  </div>
                </div>
                <div className="task-badges compact-badges">
                  <span className="priority-badge">{task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel side-panel">
          <div className="panel-header">
            <h3>Ekip durumu</h3>
          </div>

          <div className="team-status-list">
            {teamStatus.map((member) => (
              <div key={member.name} className="team-status-item">
                <div className="team-status-head">
                  <strong>{member.name}</strong>
                  <span className={`status-pill ${member.status.toLowerCase()}`}>{member.status}</span>
                </div>
                <div className="team-status-meta">
                  <span>Aktif: {member.active}</span>
                  <span>Geciken: {member.late}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel team-panel">
          <div className="panel-header">
            <h3>Takım performansı</h3>
          </div>

          <div className="team-list">
            {teamStatus.map((member) => (
              <div key={`${member.name}-performance`} className="team-member">
                <div className="member-info">
                  <div className="avatar">{member.name.charAt(0)}</div>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.status}</span>
                  </div>
                </div>
                <div className="member-progress">
                  <div className="progress-track">
                    <span style={{ width: `${member.active * 20}%` }} />
                  </div>
                  <small>{member.active * 20}%</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel metrics-panel">
          <div className="panel-header">
            <h3>Özet</h3>
          </div>
          <div className="metric-stack">
            <div>
              <span>Toplam iş</span>
              <strong>24</strong>
            </div>
            <div>
              <span>Geciken</span>
              <strong>4</strong>
            </div>
            <div>
              <span>Riskli</span>
              <strong>3</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderNotesPage = () => (
    <div className="notes-page">
      <div className="notes-topbar">
        <div>
          <p className="eyebrow">Takip</p>
          <h2>Notlarım</h2>
        </div>
      </div>

      <section className="panel notes-form-panel">
        <div className="panel-header">
          <h3>+ Not ekle</h3>
        </div>

        <div className="notes-form">
          <label className="field-group">
            <span>Not metni</span>
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              rows="3"
              placeholder="Notunuzu yazın..."
            />
          </label>

          <label className="field-group compact-field">
            <span>Takip tarihi</span>
            <input
              type="date"
              value={noteDate}
              onChange={(event) => setNoteDate(event.target.value)}
            />
          </label>

          <button type="button" className="primary-btn notes-add-btn" onClick={addNote}>
            + Not ekle
          </button>
        </div>
      </section>

      <section className="panel notes-section">
        <div className="panel-header">
          <h3>Tarihi gelen notlar</h3>
        </div>

        <div className="notes-list overdue-list">
          {overdueNotes.length > 0 ? (
            overdueNotes.map((note) => {
              const overdueDays = Math.abs(getDateDifference(note.dueDate));
              const label = overdueDays === 0 ? 'Bugün' : `${overdueDays} gün gecikti`;

              return (
                <article key={note.id} className="note-card note-card-overdue">
                  <div className="note-card-head">
                    <p>{note.text}</p>
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => completeNote(note.id)}
                      disabled={note.completed}
                    >
                      {note.completed ? 'Tamamlandı' : 'Tamamla'}
                    </button>
                  </div>
                  <div className="note-meta-row">
                    <span>Takip tarihi: {formatDate(note.dueDate)}</span>
                    <span className="delay-pill">{label}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">Tarihi gelen tamamlanmamış not bulunmuyor.</div>
          )}
        </div>
      </section>

      <section className="panel notes-section">
        <div className="panel-header notes-header-row">
          <h3>Tüm notlar</h3>
          <button
            type="button"
            className="filter-btn"
            onClick={() => setShowCompleted((current) => !current)}
          >
            {showCompleted ? 'Tamamlananlar açık' : 'Tamamlananlar'}
          </button>
        </div>

        <div className="notes-list all-notes-list">
          {futureOpenNotes.length > 0 ? (
            futureOpenNotes.map((note) => {
              const daysLeft = getDateDifference(note.dueDate);
              const isCloseToDue = daysLeft <= 3 && daysLeft >= 0;

              return (
                <article
                  key={note.id}
                  className={`note-card ${isCloseToDue ? 'note-card-warning' : ''}`}
                >
                  <div className="note-card-head">
                    <p>{note.text}</p>
                    <button
                      type="button"
                      className="small-btn"
                      onClick={() => completeNote(note.id)}
                      disabled={note.completed}
                    >
                      {note.completed ? 'Tamamlandı' : 'Tamamla'}
                    </button>
                  </div>
                  <div className="note-meta-row">
                    <span>Takip tarihi: {formatDate(note.dueDate)}</span>
                    {isCloseToDue && <span className="warning-pill">{daysLeft === 0 ? 'Bugün' : `${daysLeft} gün kaldı`}</span>}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">Gelecek açık not bulunmuyor.</div>
          )}

          {showCompleted && completedNotes.length > 0 && (
            <div className="completed-block">
              <h4>Tamamlananlar</h4>
              {completedNotes.map((note) => (
                <article key={note.id} className="note-card note-card-completed">
                  <div className="note-card-head">
                    <p>{note.text}</p>
                    <span className="status-done">Tamamlandı</span>
                  </div>
                  <div className="note-meta-row">
                    <span>Takip tarihi: {formatDate(note.dueDate)}</span>
                    <span>Tamamlama tarihi: {formatDate(note.completedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {showCompleted && completedNotes.length === 0 && (
            <div className="empty-state">Tamamlanan not bulunmuyor.</div>
          )}
        </div>
      </section>
    </div>
  );

  const renderTasksPage = () => (
    <div className="tasks-page">
      <div className="tasks-topbar">
        <div>
          <p className="eyebrow">Planlama</p>
          <h2>Çalışmalar</h2>
        </div>
        <button type="button" className="primary-btn">+ Yeni çalışma</button>
      </div>

      <section className="panel tasks-filter-panel">
        <div className="task-filters">
          <label className="field-group task-search-field">
            <span>Ara</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Çalışma ara..."
            />
          </label>

          <label className="field-group compact-field">
            <span>Sorumlu</span>
            <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
              <option>Tümü</option>
              {Array.from(new Set(workItems.map((item) => item.owner))).map((owner) => (
                <option key={owner}>{owner}</option>
              ))}
            </select>
          </label>

          <label className="field-group compact-field">
            <span>Durum</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Tümü</option>
              {Array.from(new Set(workItems.map((item) => item.status))).map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="field-group compact-field">
            <span>Öncelik</span>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option>Tümü</option>
              {Array.from(new Set(workItems.map((item) => item.priority))).map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>

          <label className="field-group compact-field">
            <span>İş tipi</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option>Tümü</option>
              {Array.from(new Set(workItems.map((item) => item.type))).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="field-group compact-field">
            <span>OKR</span>
            <select value={okrFilter} onChange={(event) => setOkrFilter(event.target.value)}>
              <option>Tümü</option>
              {Array.from(new Set(workItems.map((item) => item.okr))).map((okr) => (
                <option key={okr}>{okr}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="panel tasks-list-panel">
        <div className="tasks-list">
          {filteredWorkItems.length > 0 ? (
            filteredWorkItems.map((item) => {
              const diff = getDateDifference(item.deadline);
              const deadlineText =
                diff < 0 ? `${Math.abs(diff)} gün gecikti` : diff === 0 ? 'Bugün' : `${diff} gün kaldı`;

              return (
                <article key={item.id} className="task-row-card">
                  <div className="task-row-header">
                    <h3>{item.name}</h3>
                    <span className={`task-priority-pill ${item.priority.toLowerCase()}`}>{item.priority}</span>
                  </div>

                  <div className="task-meta-grid">
                    <div>
                      <span>Sorumlu</span>
                      <strong>{item.owner}</strong>
                    </div>
                    <div>
                      <span>İş tipi</span>
                      <strong>{item.type}</strong>
                    </div>
                    <div>
                      <span>Öncelik</span>
                      <strong>{item.priority}</strong>
                    </div>
                    <div>
                      <span>OKR</span>
                      <strong>{item.okr}</strong>
                    </div>
                    <div>
                      <span>Deadline</span>
                      <strong>{formatDate(item.deadline)}</strong>
                    </div>
                    <div>
                      <span>Deadline durumu</span>
                      <strong className={diff < 0 ? 'deadline-overdue' : ''}>{deadlineText}</strong>
                    </div>
                  </div>

                  <div className="task-status-row">
                    <span className={`task-status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">Arama kriterine uygun çalışma bulunamadı.</div>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">ET</div>
          <div>
            <p className="eyebrow">Yönetim</p>
            <h1>EkipTakip</h1>
          </div>
        </div>

        <nav className="nav">
          <button
            type="button"
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-item ${activeView === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveView('notes')}
          >
            Notlarım
          </button>
          <button
            type="button"
            className={`nav-item ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            Çalışmalar
          </button>
          <button className="nav-item">Takvim</button>
          <button className="nav-item">Ekip</button>
          <button className="nav-item">OKR</button>
          <button className="nav-item">Raporlar</button>
          <button className="nav-item">Ayarlar</button>
        </nav>

        <div className="mini-card">
          <p className="eyebrow">Bu ay</p>
          <h3>84% hedefe ulaşıldı</h3>
          <div className="progress-bar">
            <span style={{ width: '84%' }} />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        {activeView === 'notes' ? renderNotesPage() : activeView === 'tasks' ? renderTasksPage() : renderDashboard()}
      </main>
    </div>
  );
}

export default App;
