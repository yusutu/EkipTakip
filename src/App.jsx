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

const teamMembers = [
  { id: 'elif', name: 'Elif Demir', role: 'Ürün Tasarımcısı', initials: 'ED', checkIn: '12 Eylül', strengths: ['Kullanıcı içgörülerini tasarıma dönüştürme', 'Paydaş iletişimi', 'Detay odağı'], developmentAreas: ['Kararları daha erken görünür kılmak', 'Araştırma bulgularını sayısallaştırmak'], notes: ['Son sprintte müşteri görüşmelerini iyi sentezledi.', 'Tasarım kararlarını ürün ekibiyle daha erken paylaşması bekleniyor.'], feedback: [{ date: '28 Ağustos 2026', author: 'Gökhan', text: 'Ödeme akışındaki alternatifleri netleştiren güçlü bir sunum hazırladı.', type: 'Olumlu' }, { date: '14 Ağustos 2026', author: 'Gökhan', text: 'Araştırma çıktılarında etki ölçümünü bir sonraki döngüde birlikte belirleyeceğiz.', type: 'Gelişim' }], actions: [{ title: 'Araştırma etki metriği oluştur', due: '18 Eylül 2026', status: 'Planlandı' }, { title: 'Tasarım karar günlüğünü paylaş', due: '05 Eylül 2026', status: 'Devam ediyor' }] },
  { id: 'yasir', name: 'Yasir Kaya', role: 'Mobil Geliştirici', initials: 'YK', checkIn: '10 Eylül', strengths: ['Sahiplenme', 'Teknik problem çözme', 'Ekip içi destek'], developmentAreas: ['Tahminleri daha erken güncellemek', 'Teknik kararları dokümante etmek'], notes: ['Mobil bildirim akışındaki riskleri erkenden görünür kıldı.', 'Odak alanlarını haftalık görüşmede gözden geçirmek faydalı olur.'], feedback: [{ date: '26 Ağustos 2026', author: 'Gökhan', text: 'Karmaşık hata senaryolarını sakin ve sistematik biçimde çözdü.', type: 'Olumlu' }, { date: '08 Ağustos 2026', author: 'Gökhan', text: 'Tahmin değişikliklerini ekip ile daha erken paylaşması gerekiyor.', type: 'Gelişim' }], actions: [{ title: 'Teknik karar kaydı başlat', due: '12 Eylül 2026', status: 'Devam ediyor' }, { title: 'Sprint tahmin retrosu yap', due: '19 Eylül 2026', status: 'Planlandı' }] },
  { id: 'berat', name: 'Berat Yıldız', role: 'Veri Analisti', initials: 'BY', checkIn: '17 Eylül', strengths: ['Analitik düşünme', 'Veri hikayeleştirme', 'Titizlik'], developmentAreas: ['Önceliklendirme', 'Bulguları kısa özetlemek'], notes: ['Raporlardaki veri kalitesi kontrolleri güven veriyor.', 'Yönetici özeti için daha kısa ve karar odaklı çıktı üretebilir.'], feedback: [{ date: '22 Ağustos 2026', author: 'Gökhan', text: 'KPI analizindeki veri tutarsızlığını zamanında yakaladı.', type: 'Olumlu' }], actions: [{ title: 'Yönetici özeti şablonu dene', due: '20 Eylül 2026', status: 'Planlandı' }] },
  { id: 'fuat', name: 'Fuat Arslan', role: 'İçerik Stratejisti', initials: 'FA', checkIn: '15 Eylül', strengths: ['İçerik kurgusu', 'Yaratıcı fikir üretimi', 'İş birliği'], developmentAreas: ['Performans analizi', 'Kapsam yönetimi'], notes: ['Yayın takvimi paydaşlardan olumlu geri dönüş aldı.'], feedback: [{ date: '19 Ağustos 2026', author: 'Gökhan', text: 'Yeni içerik serisi için hedef kitleyi iyi tanımladı.', type: 'Olumlu' }], actions: [{ title: 'İçerik performans panosunu incele', due: '16 Eylül 2026', status: 'Planlandı' }] },
];

const initialTeamProfiles = teamMembers.map((member) => ({
  ...member,
  lastMeeting: member.feedback[0]?.date || 'Henüz görüşme yok',
  nextMeeting: member.checkIn,
  notes: member.notes.map((text, index) => ({ id: `${member.id}-note-${index}`, date: index === 0 ? '25 Ağustos 2026' : '18 Ağustos 2026', text })),
  feedback: member.feedback.map((feedback, index) => ({ ...feedback, id: `${member.id}-feedback-${index}`, topic: 'Gelişim görüşmesi', followUpDate: '' })),
  actions: member.actions.map((action, index) => ({ ...action, id: `${member.id}-action-${index}`, completed: false })),
}));

const initialNotes = [
  { id: 1, text: 'Müşteri geri bildirimleri için ödeme ekranı revizyonu öncelikli hale getirildi.', dueDate: '2026-08-25', completed: false, completedAt: null },
  { id: 2, text: 'Takım toplantısında mobil bildirim akışı için 2 iş günü eklendi.', dueDate: '2026-08-24', completed: false, completedAt: null },
  { id: 3, text: 'Riskli iş akışları için QA kontrol listesinin güncellenmesi istendi.', dueDate: '2026-08-28', completed: false, completedAt: null },
  { id: 4, text: 'Yatırım sonrası rapor için ekip kontrol listesi hazırlandı.', dueDate: '2026-08-20', completed: true, completedAt: '2026-08-21' },
];

const initialWorkItems = [
  { id: 1, name: 'Ödeme ekranı revizyonu', owner: 'Elif', type: 'Frontend', priority: 'Yüksek', okr: 'Müşteri memnuniyeti', deadline: '2026-08-24', status: 'Devam ediyor', effort: 'Orta', description: '', completedAt: null },
  { id: 2, name: 'Mobil bildirim akışı', owner: 'Yasir', type: 'Mobil', priority: 'Orta', okr: 'Kullanıcı katılımı', deadline: '2026-08-30', status: 'Beklemede', effort: 'Büyük', description: '', completedAt: null },
  { id: 3, name: 'Kullanıcı raporları', owner: 'Berat', type: 'Analiz', priority: 'Yüksek', okr: 'Veri odaklı kararlar', deadline: '2026-08-21', status: 'Riskli', effort: 'Orta', description: '', completedAt: null },
  { id: 4, name: 'İçerik yayın takvimi', owner: 'Fuat', type: 'Pazarlama', priority: 'Düşük', okr: 'Marka görünürlüğü', deadline: '2026-09-02', status: 'Devam ediyor', effort: 'Küçük', description: '', completedAt: null },
  { id: 5, name: 'Teslimat KPI analizi', owner: 'Sefer', type: 'Analiz', priority: 'Orta', okr: 'Operasyon verimliliği', deadline: '2026-08-18', status: 'Tamamlandı', effort: 'Orta', description: '', completedAt: null },
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

const getMonthDays = (year, month) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Pazartesi = 0

  const days = Array(firstWeekday).fill(null);
  for (let day = 1; day <= lastDay; day += 1) {
    days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
};

const initialFormData = {
  name: '',
  owner: '',
  type: '',
  priority: 'Orta',
  startDate: getTodayValue(),
  deadline: '',
  status: 'Planlandı',
  effort: 'Orta',
  okr: '',
  linkedTactic: '',
  linkedStep: '',
  description: '',
};

const initialTactics = [
  { id: 1, name: 'Müşteri memnuniyeti', progress: 75, status: 'Devam ediyor', targetDate: '2026-09-15', updatedAt: getTodayValue() },
  { id: 2, name: 'Kullanıcı katılımı', progress: 60, status: 'Devam ediyor', targetDate: '2026-09-20', updatedAt: getTodayValue() },
  { id: 3, name: 'Veri odaklı kararlar', progress: 45, status: 'Planlandı', targetDate: '2026-10-01', updatedAt: getTodayValue() },
  { id: 4, name: 'Marka görünürlüğü', progress: 85, status: 'Devam ediyor', targetDate: '2026-09-10', updatedAt: getTodayValue() },
  { id: 5, name: 'Operasyon verimliliği', progress: 30, status: 'Beklemede', targetDate: '2026-10-15', updatedAt: getTodayValue() },
];

const initialTacticsFormData = {
  name: '',
  progress: 0,
  status: 'Planlandı',
  targetDate: '',
};

const initialSteps = [
  { id: 1, tacticId: 1, name: 'Kullanıcı araştırması', owner: 'Elif', status: 'Tamamlandı', progress: 100 },
  { id: 2, tacticId: 1, name: 'UI revizyonu', owner: 'Elif', status: 'Devam ediyor', progress: 75 },
  { id: 3, tacticId: 2, name: 'Bildirim sistemi', owner: 'Yasir', status: 'Devam ediyor', progress: 60 },
  { id: 4, tacticId: 4, name: 'Marka kılavuzu', owner: 'Fuat', status: 'Tamamlandı', progress: 100 },
];

const initialStepsFormData = {
  tacticId: null,
  name: '',
  owner: '',
  status: 'Planlandı',
  progress: 0,
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState('elif');
  const [teamProfiles, setTeamProfiles] = useState(initialTeamProfiles);
  const [traitDraft, setTraitDraft] = useState({ type: 'strengths', text: '' });
  const [noteDraft, setNoteDraft] = useState({ date: getTodayValue(), text: '' });
  const [feedbackDraft, setFeedbackDraft] = useState({ date: getTodayValue(), topic: '', type: 'Olumlu', text: '', followUpDate: '' });
  const [actionDraft, setActionDraft] = useState({ title: '', due: '', status: 'Planlandı' });
  const [editingActionId, setEditingActionId] = useState(null);
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
  const [workItems, setWorkItems] = useState(initialWorkItems);
  const [showWorkItemModal, setShowWorkItemModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingWorkItemId, setEditingWorkItemId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [tactics, setTactics] = useState(initialTactics);
  const [showTacticsModal, setShowTacticsModal] = useState(false);
  const [tacticsFormData, setTacticsFormData] = useState(initialTacticsFormData);
  const [steps, setSteps] = useState(initialSteps);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [stepsFormData, setStepsFormData] = useState(initialStepsFormData);
  const [expandedTactic, setExpandedTactic] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const [calendarTimeFilter, setCalendarTimeFilter] = useState('Tümü');
  const [calendarOwnerFilter, setCalendarOwnerFilter] = useState('Tümü');

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

  const monthlyGoalPercent = useMemo(() => {
    const today = new Date();
    const currentMonthItems = workItems.filter((item) => {
      if (!item.deadline) return false;
      const deadlineDate = new Date(`${item.deadline}T00:00:00`);
      return deadlineDate.getFullYear() === today.getFullYear() && deadlineDate.getMonth() === today.getMonth();
    });

    if (currentMonthItems.length === 0) return 0;

    const completedItems = currentMonthItems.filter((item) => item.status === 'Tamamlandı');
    return Math.round((completedItems.length / currentMonthItems.length) * 100);
  }, [workItems]);

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

  const handleFormChange = (field, value) => {
    setFormData((current) => {
      const updated = { ...current, [field]: value };
      // linkedTactic değiştiğinde linkedStep'i sıfırla
      if (field === 'linkedTactic') {
        updated.linkedStep = '';
      }
      return updated;
    });
  };

  const handleSaveWorkItem = () => {
    if (!formData.name.trim() || !formData.owner || !formData.type || !formData.deadline) {
      console.warn('Lütfen gerekli alanları doldurunuz: Çalışma adı, Sorumlu kişi, İş tipi ve Deadline');
      return;
    }

    if (editingWorkItemId) {
      setWorkItems((current) =>
        current.map((item) =>
          item.id === editingWorkItemId
            ? {
                ...item,
                name: formData.name.trim(),
                owner: formData.owner,
                type: formData.type,
                priority: formData.priority,
                okr: formData.okr || 'Belirtilmemiş',
                linkedTactic: formData.linkedTactic || null,
                linkedStep: formData.linkedStep || null,
                deadline: formData.deadline,
                status: formData.status,
                effort: formData.effort,
                description: formData.description.trim(),
                completedAt: formData.status === 'Tamamlandı' ? (item.completedAt || getTodayValue()) : null,
              }
            : item
        )
      );
    } else {
      const newWorkItem = {
        id: Date.now(),
        name: formData.name.trim(),
        owner: formData.owner,
        type: formData.type,
        priority: formData.priority,
        okr: formData.okr || 'Belirtilmemiş',
        linkedTactic: formData.linkedTactic || null,
        linkedStep: formData.linkedStep || null,
        deadline: formData.deadline,
        status: formData.status,
        effort: formData.effort,
        description: formData.description.trim(),
        completedAt: formData.status === 'Tamamlandı' ? getTodayValue() : null,
      };

      setWorkItems((current) => [newWorkItem, ...current]);
    }

    setFormData(initialFormData);
    setEditingWorkItemId(null);
    setShowWorkItemModal(false);
  };

  const handleEditWorkItem = (item) => {
    setFormData({
      name: item.name,
      owner: item.owner,
      type: item.type,
      priority: item.priority,
      startDate: item.startDate || getTodayValue(),
      deadline: item.deadline,
      status: item.status,
      effort: item.effort,
      okr: item.okr === 'Belirtilmemiş' ? '' : item.okr,
      linkedTactic: item.linkedTactic || '',
      linkedStep: item.linkedStep || '',
      description: item.description || '',
    });
    setEditingWorkItemId(item.id);
    setShowWorkItemModal(true);
  };

  const handleDeleteWorkItem = (id) => {
    setWorkItems((current) => current.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
  };

  const handleCloseWorkItemModal = () => {
    setShowWorkItemModal(false);
    setFormData(initialFormData);
    setEditingWorkItemId(null);
  };

  const getTacticSteps = (tacticId) => {
    if (!tacticId) return [];
    return steps.filter((step) => step.tacticId === parseInt(tacticId));
  };

  const handleCompleteWorkItem = (id) => {
    setWorkItems((current) =>
      current.map((item) =>
        item.id === id && item.status !== 'Tamamlandı'
          ? { ...item, status: 'Tamamlandı', completedAt: getTodayValue() }
          : item
      )
    );
  };

  const handleTacticsFormChange = (field, value) => {
    setTacticsFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveTactic = () => {
    if (!tacticsFormData.name.trim() || !tacticsFormData.targetDate) {
      console.warn('Lütfen taktik adı ve hedef tarihini doldurunuz');
      return;
    }

    const newTactic = {
      id: Date.now(),
      name: tacticsFormData.name.trim(),
      progress: parseInt(tacticsFormData.progress) || 0,
      status: tacticsFormData.status,
      targetDate: tacticsFormData.targetDate,
      updatedAt: getTodayValue(),
    };

    setTactics((current) => [newTactic, ...current]);
    setTacticsFormData(initialTacticsFormData);
    setShowTacticsModal(false);
  };

  const handleUpdateTacticProgress = (id, progress) => {
    setTactics((current) =>
      current.map((tactic) =>
        tactic.id === id
          ? { ...tactic, progress: Math.min(100, Math.max(0, progress)), updatedAt: getTodayValue() }
          : tactic
      )
    );
  };

  const handleStepsFormChange = (field, value) => {
    setStepsFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveStep = () => {
    if (!stepsFormData.name.trim() || !stepsFormData.owner || !stepsFormData.tacticId) {
      console.warn('Lütfen adım adı, sorumlu kişi ve taktiği doldurunuz');
      return;
    }

    const newStep = {
      id: Date.now(),
      tacticId: stepsFormData.tacticId,
      name: stepsFormData.name.trim(),
      owner: stepsFormData.owner,
      status: stepsFormData.status,
      progress: parseInt(stepsFormData.progress) || 0,
    };

    setSteps((current) => [newStep, ...current]);
    setStepsFormData(initialStepsFormData);
    setShowStepsModal(false);
  };

  const handleUpdateStepProgress = (id, progress) => {
    setSteps((current) =>
      current.map((step) =>
        step.id === id
          ? { ...step, progress: Math.min(100, Math.max(0, progress)) }
          : step
      )
    );
  };

  const calculateTacticProgressFromSteps = (tacticId) => {
    const tacticSteps = getTacticSteps(tacticId);
    if (tacticSteps.length === 0) return null;
    const avgProgress = Math.round(
      tacticSteps.reduce((sum, step) => sum + step.progress, 0) / tacticSteps.length
    );
    return avgProgress;
  };

  const getTacticWorkItems = (tacticId) => {
    return workItems.filter((item) => item.linkedTactic && parseInt(item.linkedTactic) === tacticId);
  };

  const getStepName = (stepId) => {
    const step = steps.find((s) => s.id === parseInt(stepId));
    return step ? step.name : null;
  };

  const renderWorkItemModal = () => {
    const owners = Array.from(new Set(workItems.map((item) => item.owner)));
    const types = Array.from(new Set(workItems.map((item) => item.type)));

    return (
      <div className={`modal-overlay ${showWorkItemModal ? 'show' : ''}`} onClick={handleCloseWorkItemModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{editingWorkItemId ? 'Çalışmayı düzenle' : '+ Yeni çalışma'}</h2>
            <button className="modal-close-btn" onClick={handleCloseWorkItemModal}>✕</button>
          </div>

          <div className="modal-body">
            <label className="field-group">
              <span>Çalışma adı *</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Çalışma adını giriniz..."
              />
            </label>

            <div className="form-row">
              <label className="field-group">
                <span>Sorumlu kişi *</span>
                <select value={formData.owner} onChange={(e) => handleFormChange('owner', e.target.value)}>
                  <option value="">Seçiniz</option>
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                <span>İş tipi *</span>
                <select value={formData.type} onChange={(e) => handleFormChange('type', e.target.value)}>
                  <option value="">Seçiniz</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label className="field-group">
                <span>Öncelik *</span>
                <select value={formData.priority} onChange={(e) => handleFormChange('priority', e.target.value)}>
                  <option value="Düşük">Düşük</option>
                  <option value="Orta">Orta</option>
                  <option value="Yüksek">Yüksek</option>
                  <option value="Kritik">Kritik</option>
                </select>
              </label>

              <label className="field-group">
                <span>Efor *</span>
                <select value={formData.effort} onChange={(e) => handleFormChange('effort', e.target.value)}>
                  <option value="Küçük">Küçük</option>
                  <option value="Orta">Orta</option>
                  <option value="Büyük">Büyük</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label className="field-group">
                <span>Başlangıç tarihi *</span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                />
              </label>

              <label className="field-group">
                <span>Deadline *</span>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleFormChange('deadline', e.target.value)}
                />
              </label>
            </div>

            <label className="field-group">
              <span>Durum *</span>
              <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                <option value="Planlandı">Planlandı</option>
                <option value="Devam ediyor">Devam ediyor</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </label>

            <label className="field-group">
              <span>Bağlı Taktik (Opsiyonel)</span>
              <select value={formData.linkedTactic} onChange={(e) => handleFormChange('linkedTactic', e.target.value)}>
                <option value="">Taktik seçiniz</option>
                {tactics.map((tactic) => (
                  <option key={tactic.id} value={tactic.id}>{tactic.name}</option>
                ))}
              </select>
            </label>

            {formData.linkedTactic && getTacticSteps(formData.linkedTactic).length > 0 && (
              <label className="field-group">
                <span>Bağlı Adım (Opsiyonel)</span>
                <select value={formData.linkedStep} onChange={(e) => handleFormChange('linkedStep', e.target.value)}>
                  <option value="">Adım seçiniz</option>
                  {getTacticSteps(formData.linkedTactic).map((step) => (
                    <option key={step.id} value={step.id}>{step.name}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="field-group">
              <span>Kısa açıklama/Not</span>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Çalışma hakkında notlar yazınız..."
                rows="3"
              />
            </label>
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCloseWorkItemModal}>İptal</button>
            <button className="primary-btn" onClick={handleSaveWorkItem}>{editingWorkItemId ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmModal = () => {
    const item = workItems.find((w) => w.id === deleteConfirmId);

    return (
      <div className={`modal-overlay ${deleteConfirmId ? 'show' : ''}`} onClick={() => setDeleteConfirmId(null)}>
        <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Çalışmayı sil</h2>
            <button className="modal-close-btn" onClick={() => setDeleteConfirmId(null)}>✕</button>
          </div>

          <div className="modal-body">
            <p>{item ? `"${item.name}" çalışmasını silmek istediğinize emin misiniz?` : ''}</p>
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={() => setDeleteConfirmId(null)}>İptal</button>
            <button className="danger-btn" onClick={() => handleDeleteWorkItem(deleteConfirmId)}>Sil</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTacticsModal = () => (
    <div className={`modal-overlay ${showTacticsModal ? 'show' : ''}`} onClick={() => setShowTacticsModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>+ Yeni taktik</h2>
          <button className="modal-close-btn" onClick={() => setShowTacticsModal(false)}>✕</button>
        </div>

        <div className="modal-body">
          <label className="field-group">
            <span>Taktik adı *</span>
            <input
              type="text"
              value={tacticsFormData.name}
              onChange={(e) => handleTacticsFormChange('name', e.target.value)}
              placeholder="Taktik adını giriniz..."
            />
          </label>

          <label className="field-group">
            <span>Hedef tarih *</span>
            <input
              type="date"
              value={tacticsFormData.targetDate}
              onChange={(e) => handleTacticsFormChange('targetDate', e.target.value)}
            />
          </label>

          <label className="field-group">
            <span>Durum</span>
            <select value={tacticsFormData.status} onChange={(e) => handleTacticsFormChange('status', e.target.value)}>
              <option value="Planlandı">Planlandı</option>
              <option value="Devam ediyor">Devam ediyor</option>
              <option value="Beklemede">Beklemede</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
          </label>

          <label className="field-group">
            <span>İlerleme yüzdesi</span>
            <input
              type="number"
              min="0"
              max="100"
              value={tacticsFormData.progress}
              onChange={(e) => handleTacticsFormChange('progress', e.target.value)}
              placeholder="0"
            />
          </label>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={() => setShowTacticsModal(false)}>İptal</button>
          <button className="primary-btn" onClick={handleSaveTactic}>Kaydet</button>
        </div>
      </div>
    </div>
  );

  const renderStepsModal = () => {
    const owners = Array.from(new Set(workItems.map((item) => item.owner)));
    return (
      <div className={`modal-overlay ${showStepsModal ? 'show' : ''}`} onClick={() => setShowStepsModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>+ Yeni adım</h2>
            <button className="modal-close-btn" onClick={() => setShowStepsModal(false)}>✕</button>
          </div>

          <div className="modal-body">
            <label className="field-group">
              <span>Adım adı *</span>
              <input
                type="text"
                value={stepsFormData.name}
                onChange={(e) => handleStepsFormChange('name', e.target.value)}
                placeholder="Adım adını giriniz..."
              />
            </label>

            <label className="field-group">
              <span>Sorumlu kişi *</span>
              <select value={stepsFormData.owner} onChange={(e) => handleStepsFormChange('owner', e.target.value)}>
                <option value="">Seçiniz</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Durum</span>
              <select value={stepsFormData.status} onChange={(e) => handleStepsFormChange('status', e.target.value)}>
                <option value="Planlandı">Planlandı</option>
                <option value="Devam ediyor">Devam ediyor</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </label>

            <label className="field-group">
              <span>İlerleme yüzdesi</span>
              <input
                type="number"
                min="0"
                max="100"
                value={stepsFormData.progress}
                onChange={(e) => handleStepsFormChange('progress', e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <div className="modal-footer">
            <button className="cancel-btn" onClick={() => setShowStepsModal(false)}>İptal</button>
            <button className="primary-btn" onClick={handleSaveStep}>Kaydet</button>
          </div>
        </div>
      </div>
    );
  };

  const renderOKRPage = () => (
    <div className="okr-page">
      <div className="okr-topbar">
        <div>
          <p className="eyebrow">Planlama</p>
          <h2>OKR / Taktik takibi</h2>
        </div>
        <button type="button" className="primary-btn" onClick={() => setShowTacticsModal(true)}>+ Yeni taktik</button>
      </div>

      <section className="panel tactics-list-panel">
        <div className="tactics-list">
          {tactics.length > 0 ? (
            tactics.map((tactic) => (
              <article key={tactic.id} className="tactic-card">
                <div className="tactic-header">
                  <h3>{tactic.name}</h3>
                  <span className={`tactic-status-badge ${tactic.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {tactic.status}
                  </span>
                </div>

                <div className="tactic-content">
                  <div className="progress-section">
                    <div className="progress-header">
                      <span>İlerleme</span>
                      <strong>{tactic.progress}%</strong>
                    </div>
                    <div className="progress-track">
                      <span style={{ width: `${tactic.progress}%` }} />
                    </div>
                    <div className="progress-input-wrapper">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tactic.progress}
                        onChange={(e) => handleUpdateTacticProgress(tactic.id, parseInt(e.target.value) || 0)}
                        className="progress-input"
                      />
                      <span className="progress-unit">%</span>
                    </div>
                  </div>

                  <div className="tactic-meta">
                    <div>
                      <span>Hedef tarih</span>
                      <strong>{formatDate(tactic.targetDate)}</strong>
                    </div>
                    <div>
                      <span>Son güncelleme</span>
                      <strong>{formatDate(tactic.updatedAt)}</strong>
                    </div>
                  </div>
                </div>

                <div className="tactic-steps-section">
                  <button
                    className="steps-toggle-btn"
                    onClick={() => setExpandedTactic(expandedTactic === tactic.id ? null : tactic.id)}
                  >
                    <span className="steps-label">
                      Adımlar ({getTacticSteps(tactic.id).length})
                    </span>
                    <span className={`toggle-icon ${expandedTactic === tactic.id ? 'expanded' : ''}`}>▼</span>
                  </button>

                  {expandedTactic === tactic.id && (
                    <div className="steps-list-wrapper">
                      {getTacticSteps(tactic.id).length > 0 ? (
                        <div className="steps-list">
                          {getTacticSteps(tactic.id).map((step) => (
                            <div key={step.id} className="step-item">
                              <div className="step-header">
                                <strong>{step.name}</strong>
                                <span className={`step-status-badge ${step.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                  {step.status}
                                </span>
                              </div>

                              <div className="step-meta">
                                <div>
                                  <span>Sorumlu</span>
                                  <strong>{step.owner}</strong>
                                </div>
                                <div>
                                  <span>İlerleme</span>
                                  <div className="step-progress">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={step.progress}
                                      onChange={(e) => handleUpdateStepProgress(step.id, parseInt(e.target.value) || 0)}
                                      className="step-progress-input"
                                    />
                                    <span>%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-steps">Henüz adım eklenmedi.</div>
                      )}

                      <button
                        className="add-step-btn"
                        onClick={() => {
                          setStepsFormData({ ...initialStepsFormData, tacticId: tactic.id });
                          setShowStepsModal(true);
                        }}
                      >
                        + Adım ekle
                      </button>
                    </div>
                  )}
                </div>

                <div className="tactic-workitems-section">
                  <h4 className="workitems-title">Bağlı Çalışmalar</h4>
                  {getTacticWorkItems(tactic.id).length > 0 ? (
                    <div className="workitems-list">
                      {getTacticWorkItems(tactic.id).map((item) => (
                        <div key={item.id} className="linked-workitem">
                          <div className="linked-workitem-header">
                            <strong>{item.name}</strong>
                            <span className={`work-status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="linked-workitem-meta">
                            <span>Sorumlu: {item.owner}</span>
                            {item.linkedStep && (
                              <span>Adım: {getStepName(item.linkedStep)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-workitems">Henüz bağlı çalışma yok.</div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">Henüz taktik bulunmuyor.</div>
          )}
        </div>
      </section>
    </div>
  );

  const renderCalendarPage = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthDays = getMonthDays(year, month);
    const monthLabel = calendarDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    const weekdayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const calendarOwners = Array.from(new Set(workItems.map((item) => item.owner)));

    const matchesTimeFilter = (dateStr) => {
      if (calendarTimeFilter === 'Tümü') return true;
      const diff = getDateDifference(dateStr);
      if (calendarTimeFilter === 'Gecikenler') return diff < 0;
      if (calendarTimeFilter === 'Yaklaşanlar') return diff >= 0;
      if (calendarTimeFilter === 'Bu hafta') {
        const today = new Date(`${getTodayValue()}T00:00:00`);
        const todayWeekday = (today.getDay() + 6) % 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - todayWeekday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const target = new Date(`${dateStr}T00:00:00`);
        return target >= monday && target <= sunday;
      }
      return true;
    };

    const getDayWorkItems = (dateStr) => {
      if (!matchesTimeFilter(dateStr)) return [];
      return workItems.filter(
        (item) => item.deadline === dateStr && (calendarOwnerFilter === 'Tümü' || item.owner === calendarOwnerFilter)
      );
    };

    const getDayNotes = (dateStr) => {
      if (!matchesTimeFilter(dateStr)) return [];
      return notes.filter((note) => note.dueDate === dateStr);
    };

    const selectedWorkItems = selectedCalendarDay ? getDayWorkItems(selectedCalendarDay) : [];
    const selectedNotes = selectedCalendarDay ? getDayNotes(selectedCalendarDay) : [];

    return (
      <div className="calendar-page">
        <div className="calendar-topbar">
          <div>
            <p className="eyebrow">Planlama</p>
            <h2>Takvim</h2>
          </div>
        </div>

        <section className="panel calendar-filter-panel">
          <div className="calendar-filters">
            <label className="field-group compact-field">
              <span>Zaman</span>
              <select value={calendarTimeFilter} onChange={(e) => setCalendarTimeFilter(e.target.value)}>
                <option>Tümü</option>
                <option>Bu hafta</option>
                <option>Gecikenler</option>
                <option>Yaklaşanlar</option>
              </select>
            </label>

            <label className="field-group compact-field">
              <span>Sorumlu</span>
              <select value={calendarOwnerFilter} onChange={(e) => setCalendarOwnerFilter(e.target.value)}>
                <option>Tümü</option>
                {calendarOwners.map((owner) => (
                  <option key={owner}>{owner}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="panel calendar-panel">
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => {
                setCalendarDate(new Date(year, month - 1, 1));
                setSelectedCalendarDay(null);
              }}
            >
              ‹
            </button>
            <h3 className="calendar-month-label">{monthLabel}</h3>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => {
                setCalendarDate(new Date(year, month + 1, 1));
                setSelectedCalendarDay(null);
              }}
            >
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            {weekdayLabels.map((label) => (
              <div key={label} className="calendar-weekday">{label}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {monthDays.map((dateStr, index) => {
              if (!dateStr) {
                return <div key={`empty-${index}`} className="calendar-cell empty" />;
              }

              const dayWorkItems = getDayWorkItems(dateStr);
              const dayNotes = getDayNotes(dateStr);
              const dayNumber = parseInt(dateStr.split('-')[2], 10);
              const isToday = dateStr === getTodayValue();
              const isSelected = dateStr === selectedCalendarDay;

              return (
                <button
                  type="button"
                  key={dateStr}
                  className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedCalendarDay(dateStr)}
                >
                  <span className="calendar-day-number">{dayNumber}</span>
                  <div className="calendar-dots">
                    {dayWorkItems.length > 0 && <span className="calendar-dot work-dot" />}
                    {dayNotes.length > 0 && <span className="calendar-dot note-dot" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedCalendarDay && (
          <section className="panel calendar-detail-panel">
            <div className="calendar-detail-header">
              <h3>{formatDate(selectedCalendarDay)}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedCalendarDay(null)}>✕</button>
            </div>

            <div className="calendar-detail-body">
              <div className="calendar-detail-section work-section">
                <h4>Çalışmalar</h4>
                {selectedWorkItems.length > 0 ? (
                  <div className="calendar-detail-list">
                    {selectedWorkItems.map((item) => (
                      <div key={item.id} className="calendar-detail-item work-item">
                        <strong>{item.name}</strong>
                        <span>Sorumlu: {item.owner}</span>
                        <span className={`task-status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-small">Bu tarihte çalışma yok.</div>
                )}
              </div>

              <div className="calendar-detail-section note-section">
                <h4>Notlar</h4>
                {selectedNotes.length > 0 ? (
                  <div className="calendar-detail-list">
                    {selectedNotes.map((note) => (
                      <div key={note.id} className="calendar-detail-item note-item">
                        <p>{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-small">Bu tarihte not yok.</div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  };

  const updateSelectedProfile = (updateProfile) => {
    setTeamProfiles((profiles) => profiles.map((profile) => (
      profile.id === selectedTeamMemberId ? updateProfile(profile) : profile
    )));
  };

  const addTrait = () => {
    if (!traitDraft.text.trim()) return;
    updateSelectedProfile((profile) => ({ ...profile, [traitDraft.type]: [...profile[traitDraft.type], traitDraft.text.trim()] }));
    setTraitDraft((current) => ({ ...current, text: '' }));
  };

  const removeTrait = (type, item) => updateSelectedProfile((profile) => ({ ...profile, [type]: profile[type].filter((trait) => trait !== item) }));

  const addTeamNote = () => {
    if (!noteDraft.text.trim() || !noteDraft.date) return;
    updateSelectedProfile((profile) => ({ ...profile, notes: [{ id: Date.now(), ...noteDraft, text: noteDraft.text.trim() }, ...profile.notes] }));
    setNoteDraft({ date: getTodayValue(), text: '' });
  };

  const addFeedback = () => {
    if (!feedbackDraft.date || !feedbackDraft.topic.trim() || !feedbackDraft.text.trim()) return;
    updateSelectedProfile((profile) => ({ ...profile, lastMeeting: formatDate(feedbackDraft.date), feedback: [{ id: Date.now(), author: 'Gökhan', ...feedbackDraft, text: feedbackDraft.text.trim(), topic: feedbackDraft.topic.trim() }, ...profile.feedback] }));
    setFeedbackDraft({ date: getTodayValue(), topic: '', type: 'Olumlu', text: '', followUpDate: '' });
  };

  const saveAction = () => {
    if (!actionDraft.title.trim() || !actionDraft.due) return;
    updateSelectedProfile((profile) => ({
      ...profile,
      actions: editingActionId
        ? profile.actions.map((action) => action.id === editingActionId ? { ...action, ...actionDraft, title: actionDraft.title.trim() } : action)
        : [...profile.actions, { id: Date.now(), ...actionDraft, title: actionDraft.title.trim(), completed: false }],
    }));
    setActionDraft({ title: '', due: '', status: 'Planlandı' });
    setEditingActionId(null);
  };

  const renderTeamPage = () => {
    const selectedMember = teamProfiles.find((member) => member.id === selectedTeamMemberId) || teamProfiles[0];

    return (
      <div className="team-page">
        <header className="team-topbar"><p className="eyebrow">Ekip gelişimi</p><h2>Çalışan gelişimi ve geri bildirim</h2><p>Her ekip üyesinin gelişim yolculuğunu ve görüşme notlarını takip edin.</p></header>
        <section className="member-card-grid" aria-label="Ekip üyeleri">
          {teamProfiles.map((member) => (
            <button key={member.id} type="button" className={`member-card ${member.id === selectedMember.id ? 'selected' : ''}`} onClick={() => setSelectedTeamMemberId(member.id)} aria-pressed={member.id === selectedMember.id}>
              <span className="member-card-avatar">{member.initials}</span><span className="member-card-copy"><strong>{member.name}</strong><span>{member.role}</span></span><span className="check-in-label">Son görüşme: {member.lastMeeting}</span><span className="check-in-label">Sonraki görüşme: {member.nextMeeting}</span>
            </button>
          ))}
        </section>
        <section className="development-detail" aria-live="polite">
          <div className="detail-heading"><div className="detail-avatar">{selectedMember.initials}</div><div><p className="eyebrow">Gelişim profili</p><h3>{selectedMember.name}</h3><p>{selectedMember.role}</p></div></div>
          <div className="development-grid">
            <article className="development-section strength-section"><h4>Güçlü yönler</h4><ul className="editable-list">{selectedMember.strengths.map((item) => <li key={item}>{item}<button type="button" className="inline-delete" aria-label={`Güçlü yön sil: ${item}`} onClick={() => removeTrait('strengths', item)}>Sil</button></li>)}</ul><div className="inline-form"><input aria-label="Yeni güçlü yön" value={traitDraft.type === 'strengths' ? traitDraft.text : ''} onChange={(event) => setTraitDraft({ type: 'strengths', text: event.target.value })} /><button type="button" onClick={addTrait}>Ekle</button></div></article>
            <article className="development-section area-section"><h4>Gelişim alanları</h4><ul className="editable-list">{selectedMember.developmentAreas.map((item) => <li key={item}>{item}<button type="button" className="inline-delete" aria-label={`Gelişim alanı sil: ${item}`} onClick={() => removeTrait('developmentAreas', item)}>Sil</button></li>)}</ul><div className="inline-form"><input aria-label="Yeni gelişim alanı" value={traitDraft.type === 'developmentAreas' ? traitDraft.text : ''} onChange={(event) => setTraitDraft({ type: 'developmentAreas', text: event.target.value })} /><button type="button" onClick={addTrait}>Ekle</button></div></article>
            <article className="development-section notes-section"><h4>Gözlemler ve yönetici notları</h4><div className="manager-notes">{selectedMember.notes.map((note) => <div className="dated-record" key={note.id}><small>{formatDate(note.date)}</small><p>{note.text}</p></div>)}</div><div className="record-form"><input aria-label="Gözlem tarihi" type="date" value={noteDraft.date} onChange={(event) => setNoteDraft({ ...noteDraft, date: event.target.value })} /><textarea aria-label="Yönetici notu" value={noteDraft.text} onChange={(event) => setNoteDraft({ ...noteDraft, text: event.target.value })} /><button type="button" onClick={addTeamNote}>Not ekle</button></div></article>
            <article className="development-section feedback-section"><h4>Geri bildirim geçmişi</h4><div className="feedback-list">{selectedMember.feedback.map((feedback) => <div className="feedback-item" key={feedback.id}><span className={`feedback-type ${feedback.type.toLowerCase()}`}>{feedback.type}</span><strong>{feedback.topic}</strong><p>{feedback.text}</p><small>{feedback.author} · {formatDate(feedback.date)}{feedback.followUpDate ? ` · Takip: ${formatDate(feedback.followUpDate)}` : ''}</small></div>)}</div><div className="record-form"><input aria-label="Görüşme tarihi" type="date" value={feedbackDraft.date} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, date: event.target.value })} /><input aria-label="Görüşme konusu" placeholder="Görüşme konusu" value={feedbackDraft.topic} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, topic: event.target.value })} /><select aria-label="Geri bildirim türü" value={feedbackDraft.type} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, type: event.target.value })}><option>Olumlu</option><option>Gelişim</option><option>Yapıcı</option></select><textarea aria-label="Görüşme notu" value={feedbackDraft.text} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, text: event.target.value })} /><input aria-label="Takip tarihi" type="date" value={feedbackDraft.followUpDate} onChange={(event) => setFeedbackDraft({ ...feedbackDraft, followUpDate: event.target.value })} /><button type="button" onClick={addFeedback}>Görüşme ekle</button></div></article>
            <article className="development-section actions-section"><h4>Gelişim aksiyonları</h4><div className="action-list">{selectedMember.actions.map((action) => <div className="development-action" key={action.id}><div><strong className={action.completed ? 'completed-action' : ''}>{action.title}</strong><span>Hedef tarih: {formatDate(action.due)}</span></div><span className={`action-status ${action.completed ? 'tamamlandı' : action.status.toLowerCase().replace(/\s+/g, '-')}`}>{action.completed ? 'Tamamlandı' : action.status}</span><div className="action-controls"><button type="button" onClick={() => updateSelectedProfile((profile) => ({ ...profile, actions: profile.actions.map((current) => current.id === action.id ? { ...current, completed: !current.completed } : current) }))}>{action.completed ? 'Geri al' : 'Tamamla'}</button><button type="button" onClick={() => { setActionDraft({ title: action.title, due: action.due, status: action.status }); setEditingActionId(action.id); }}>Düzenle</button><button type="button" className="inline-delete" onClick={() => updateSelectedProfile((profile) => ({ ...profile, actions: profile.actions.filter((current) => current.id !== action.id) }))}>Sil</button></div></div>)}</div><div className="record-form action-form"><input aria-label="Aksiyon adı" value={actionDraft.title} onChange={(event) => setActionDraft({ ...actionDraft, title: event.target.value })} /><input aria-label="Aksiyon hedef tarihi" type="date" value={actionDraft.due} onChange={(event) => setActionDraft({ ...actionDraft, due: event.target.value })} /><select aria-label="Aksiyon durumu" value={actionDraft.status} onChange={(event) => setActionDraft({ ...actionDraft, status: event.target.value })}><option>Planlandı</option><option>Devam ediyor</option></select><button type="button" onClick={saveAction}>{editingActionId ? 'Aksiyonu güncelle' : 'Aksiyon ekle'}</button></div></article>
          </div>
        </section>
      </div>
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
        <button type="button" className="primary-btn" onClick={() => setShowWorkItemModal(true)}>+ Yeni çalışma</button>
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
                    {item.completedAt && (
                      <div className="completion-info">
                        <span>Tamamlama tarihi:</span>
                        <strong>{formatDate(item.completedAt)}</strong>
                        {(() => {
                          const completionDiff = getDateDifference(item.deadline);
                          const isLate = new Date(item.completedAt) > new Date(`${item.deadline}T00:00:00`);
                          const daysLate = Math.ceil((new Date(item.completedAt) - new Date(`${item.deadline}T00:00:00`)) / (1000 * 60 * 60 * 24));
                          return isLate ? (
                            <span className="late-badge">{daysLate} gün gecikti</span>
                          ) : (
                            <span className="ontime-badge">Zamanında tamamlandı</span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="task-actions-row">
                    <button type="button" className="edit-item-btn" onClick={() => handleEditWorkItem(item)}>Düzenle</button>
                    <button type="button" className="delete-item-btn" onClick={() => setDeleteConfirmId(item.id)}>Sil</button>
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
          <button
            type="button"
            className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            Takvim
          </button>
          <button type="button" className={`nav-item ${activeView === 'team' ? 'active' : ''}`} onClick={() => setActiveView('team')}>Ekip</button>
          <button
            type="button"
            className={`nav-item ${activeView === 'okr' ? 'active' : ''}`}
            onClick={() => setActiveView('okr')}
          >
            OKR
          </button>
          <button className="nav-item">Raporlar</button>
          <button className="nav-item">Ayarlar</button>
        </nav>

        <div className="mini-card">
          <p className="eyebrow">Bu ay</p>
          <h3>{monthlyGoalPercent}% hedefe ulaşıldı</h3>
          <div className="progress-bar">
            <span style={{ width: `${monthlyGoalPercent}%` }} />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        {activeView === 'notes' ? renderNotesPage() : activeView === 'tasks' ? renderTasksPage() : activeView === 'okr' ? renderOKRPage() : activeView === 'calendar' ? renderCalendarPage() : activeView === 'team' ? renderTeamPage() : renderDashboard()}
      </main>

      {renderWorkItemModal()}

      {renderDeleteConfirmModal()}

      {renderTacticsModal()}

      {renderStepsModal()}
    </div>
  );
}

export default App;
