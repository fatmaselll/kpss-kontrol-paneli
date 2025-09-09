// Deneme Notları için localStorage anahtarı
const trialNotesKey = 'kpssTrialNotes';

// Deneme notlarını yükle
function loadTrialNotes() {
    const saved = localStorage.getItem(trialNotesKey);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) { return []; }
    }
    return [];
}

// Deneme notlarını kaydet
function saveTrialNotes(notes) {
    localStorage.setItem(trialNotesKey, JSON.stringify(notes));
}

// Net hesabı: net = doğru - (yanlış / 4)
function calculateNet(dogru, yanlis) {
    return Math.max(0, (dogru - (yanlis / 4))).toFixed(2);
}

// Deneme Notları Modalını aç/kapat
function showTrialNotesModal(show) {
    const modal = document.getElementById('trial-notes-modal');
    if (show) {
        modal.style.display = 'flex';
        renderTrialNotesForm();
        renderTrialNotesList();
    } else {
        modal.style.display = 'none';
    }
}

// Formu oluştur
function renderTrialNotesForm() {
    const area = document.getElementById('trial-notes-form-area');
    area.innerHTML = '';
    const dersler = topicsData.map(s=>s.subject);
    const form = document.createElement('form');
    form.id = 'trial-note-form';
    form.innerHTML = `
      <label>Ders:
        <select name="ders" required style="margin-left:8px; border-radius:8px; padding:4px 8px;">
          ${dersler.map(d=>`<option value="${d}">${d}</option>`).join('')}
        </select>
      </label>
      <label style="margin-left:16px;">Doğru <input type="number" name="dogru" min="0" max="100" value="0" style="width:48px; border-radius:8px; padding:2px 6px; margin-left:4px;" required></label>
      <label style="margin-left:8px;">Yanlış <input type="number" name="yanlis" min="0" max="100" value="0" style="width:48px; border-radius:8px; padding:2px 6px; margin-left:4px;" required></label>
      <label style="margin-left:8px;">Boş <input type="number" name="bos" min="0" max="100" value="0" style="width:48px; border-radius:8px; padding:2px 6px; margin-left:4px;" required></label>
      <button type="submit" style="margin-left:16px; background:linear-gradient(90deg,#43cea2 0%,#ffd200 100%); color:#333; border:none; border-radius:8px; padding:4px 16px; font-weight:500; cursor:pointer;">Kaydet</button>
    `;
    // Düzenleme için global değişken
    let editingIdx = null;
    if (window._editingTrialNote !== undefined) {
        editingIdx = window._editingTrialNote;
        delete window._editingTrialNote;
    }
    if (editingIdx !== null) {
        // Mevcut kaydı doldur
        const notes = loadTrialNotes();
        const n = notes[editingIdx];
        if (n) {
            form.ders.value = n.ders;
            form.dogru.value = n.dogru;
            form.yanlis.value = n.yanlis;
            form.bos.value = n.bos;
        }
    }
    form.onsubmit = function(e) {
        e.preventDefault();
        const ders = form.ders.value;
        const dogru = parseInt(form.dogru.value)||0;
        const yanlis = parseInt(form.yanlis.value)||0;
        const bos = parseInt(form.bos.value)||0;
        const net = calculateNet(dogru, yanlis);
        const now = new Date();
        const tarih = now.toLocaleDateString('tr-TR');
        const saat = now.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
        const notes = loadTrialNotes();
        if (editingIdx !== null) {
            // Güncelleme
            const eskiTarih = notes[editingIdx].tarih;
            const eskiSaat = notes[editingIdx].saat;
            notes[editingIdx] = {
                ders, dogru, yanlis, bos, net,
                tarih: eskiTarih,
                saat: eskiSaat,
                sonDuzenleme: tarih + ' ' + saat
            };
        } else {
            notes.push({ ders, dogru, yanlis, bos, net, tarih, saat });
        }
        saveTrialNotes(notes);
        renderTrialNotesList();
        form.reset();
        editingIdx = null;
    };
    area.appendChild(form);
}

// Kayıtlı notları listele
function renderTrialNotesList() {
    const area = document.getElementById('trial-notes-list-area');
    area.innerHTML = '';
    const notes = loadTrialNotes();
    if (notes.length === 0) {
        area.innerHTML = '<div style="text-align:center; color:#aaa;">Henüz kayıt yok.</div>';
        return;
    }
    // Derslere göre grupla, her dersin notları en yeni üstte olacak şekilde sırala
    const dersler = topicsData.map(s=>s.subject);
    const dersEmojiMap = {
        'Türkçe': '📚', 'Matematik': '🧮', 'Tarih': '🏛️', 'Coğrafya': '🌍', 'Vatandaşlık': '⚖️'
    };
    dersler.forEach(ders => {
        const dersNotes = notes
            .map((n, i) => ({...n, _idx: i}))
            .filter(n => n.ders === ders)
            .reverse(); // en yeni üstte
        if (dersNotes.length === 0) return;
        const dersHeader = document.createElement('div');
        dersHeader.style = 'font-size:1.15em; font-weight:600; color:#185a9d; margin:18px 0 8px 0; display:flex; align-items:center; gap:8px;';
        dersHeader.innerHTML = `<span style="font-size:1.3em;">${dersEmojiMap[ders]||'📖'}</span> ${ders}`;
        area.appendChild(dersHeader);
        dersNotes.forEach(n => {
            const box = document.createElement('div');
            box.style = 'background:linear-gradient(90deg,#f7fffc 0%,#e0e7ff 100%); border-radius:12px; box-shadow:0 1px 6px rgba(33,147,176,0.07); padding:10px 18px; margin-bottom:10px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;';
            let tarihSaat = `<span style='color:#888; font-size:0.97em; margin-left:10px;'>📅 ${n.tarih || ''} ⏰ ${n.saat || ''}`;
            if (n.sonDuzenleme) tarihSaat += ` <span style='color:#b88; font-size:0.95em;'>(Son Düzenleme: ${n.sonDuzenleme})</span>`;
            tarihSaat += '</span>';
            box.innerHTML = `✅ Doğru: <b>${n.dogru}</b> | ❌ Yanlış: <b>${n.yanlis}</b> | ⭕ Boş: <b>${n.bos}</b> | 🧮 Net: <b>${n.net}</b> ${tarihSaat}`;
            // Sil ve düzenle butonları
            const delBtn = document.createElement('button');
            delBtn.textContent = '🗑️';
            delBtn.title = 'Sil';
            delBtn.style = 'margin-left:8px; background:none; border:none; font-size:1.2em; cursor:pointer;';
            delBtn.onclick = function() {
                if (confirm('Bu kaydı silmek istiyor musunuz?')) {
                    notes.splice(n._idx,1);
                    saveTrialNotes(notes);
                    renderTrialNotesList();
                }
            };
            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.title = 'Düzenle';
            editBtn.style = 'margin-left:2px; background:none; border:none; font-size:1.2em; cursor:pointer;';
            editBtn.onclick = function() {
                // Formu doldur, silme!
                window._editingTrialNote = n._idx;
                renderTrialNotesForm();
            };
            box.appendChild(editBtn);
            box.appendChild(delBtn);
            area.appendChild(box);
        });
    });
}

// Buton ve modal açma/kapama eventleri
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('trial-notes-btn');
    const modal = document.getElementById('trial-notes-modal');
    const closeBtn = document.getElementById('close-trial-notes');
    if (btn && modal && closeBtn) {
        btn.onclick = () => showTrialNotesModal(true);
        closeBtn.onclick = () => showTrialNotesModal(false);
        modal.onclick = function(e) { if (e.target === modal) showTrialNotesModal(false); };
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const navBar = document.getElementById('nav-bar');
    const content = document.getElementById('content');
    const mottoBar = document.getElementById('motto-bar');

    // Derslere uygun emojiler
    const subjectEmojis = {
        'Türkçe': '📚',
        'Matematik': '🧮',
        'Tarih': '🏛️',
        'Coğrafya': '🌍',
        'Vatandaşlık': '⚖️'
    };


    // Özlü sözler ve emojiler
    const mottos = [
        { text: 'Başarı, hazırlık ve fırsatın buluştuğu yerdir.', emoji: '🚀' },
        { text: 'Çalışmak, başarmanın yarısıdır.', emoji: '💪' },
        { text: 'Hayallerin için vazgeçme!', emoji: '🌟' },
        { text: 'Her gün bir adım daha ileri.', emoji: '👣' },
        { text: 'Zorluklar, başarının anahtarıdır.', emoji: '🗝️' },
        { text: 'Küçük adımlar büyük farklar yaratır.', emoji: '🧩' },
        { text: 'İnanç, azim ve sabırla her şey mümkün.', emoji: '✨' },
        { text: 'Bugün, yeni bir başlangıç için en iyi gün.', emoji: '🌅' },
        { text: 'Düşün, çalış, başar!', emoji: '🎯' },
        { text: 'Kendine inan, yeter!', emoji: '🔥' }
    ];

    let lastMottoIndex = -1;
    function showRandomMotto() {
        mottoBar.innerHTML = '';
        mottoBar.className = 'fade-in-motto';
        mottoBar.style.textAlign = 'center';
        mottoBar.style.padding = '18px 0 8px 0';
        mottoBar.style.fontSize = '1.15em';
        mottoBar.style.fontWeight = '500';
        mottoBar.style.color = '#185a9d';
        mottoBar.style.letterSpacing = '0.5px';
        mottoBar.style.textShadow = '0 2px 8px rgba(33,147,176,0.07)';
        mottoBar.style.userSelect = 'none';
        // Aynı mottoyu iki kez üst üste gösterme
        let idx;
        do {
            idx = Math.floor(Math.random() * mottos.length);
        } while (idx === lastMottoIndex && mottos.length > 1);
        lastMottoIndex = idx;
        const motto = mottos[idx];
        mottoBar.innerHTML = `<span style="vertical-align:middle;">"${motto.text}"</span> <span style="font-size:1.5em;vertical-align:middle;">${motto.emoji}</span>`;
    }

    // Mottoya tıklayınca yeni motto gelsin
    mottoBar && mottoBar.addEventListener('click', function() {
        showRandomMotto();
    });

    // Hesaplama fonksiyonu: ders içindeki tamamlanan konulardan yüzde hesapla
    function calculateProgress(subject) {
        const total = subject.topics.length;
        const completed = subject.topics.filter(topic => topic.completed).length;
        return Math.round((completed / total) * 100);
    }

    // Navigation bar'ı oluşturur
    function renderNavBar() {
        navBar.innerHTML = '';
        topicsData.forEach((subject, index) => {
            const progress = calculateProgress(subject);
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.dataset.index = index;
            // Emoji ekle
            const emoji = subjectEmojis[subject.subject] || '';
            navItem.innerHTML = emoji + ' ' + subject.subject + " <span class=\"percentage\">" + progress + "%</span>";
            navItem.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                navItem.classList.add('active');
                renderSubjectDetail(subject, index);
            });
            navBar.appendChild(navItem);
        });
    }

    // Seçili dersin konularını detaylı gösterir
    function renderSubjectDetail(subject, subjectIndex) {
        content.innerHTML = '';
        const title = document.createElement('h2');
        // Emoji başlığa da ekle
        const emoji = subjectEmojis[subject.subject] || '';
        title.textContent = emoji + ' ' + subject.subject;
        title.className = 'subject-title fade-in';
        content.appendChild(title);

        subject.topics.forEach((topic, topicIndex) => {
            const topicDiv = document.createElement('div');
            topicDiv.className = 'topic-item fade-in';
            if (topic.completed) topicDiv.classList.add('completed');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = topic.completed;
            checkbox.addEventListener('change', (e) => {
                subject.topics[topicIndex].completed = e.target.checked;
                if (e.target.checked) {
                    topicDiv.classList.add('completed');
                } else {
                    topicDiv.classList.remove('completed');
                }
                saveProgress();
                renderNavBar();
            });
            topicDiv.appendChild(checkbox);

            const label = document.createElement('span');
            label.textContent = topic.title;
            topicDiv.appendChild(label);

            content.appendChild(topicDiv);
        });
    }

    // Sayfa yenilendiğinde rastgele motto göster
    showRandomMotto();

    // İlk dersin detayını yükle
    renderNavBar();
    if (topicsData.length > 0) {
        navBar.firstChild.classList.add('active');
        renderSubjectDetail(topicsData[0], 0);
    }
});
