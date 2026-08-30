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

function App() {
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
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Çalışmalar</button>
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
      </main>
    </div>
  );
}

export default App;
