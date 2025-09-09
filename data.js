/* KPSS 2026 Ön Lisans konularını içeren veri dosyası */

const topicsData = [
    {
        subject: "Türkçe",
        topics: [
            { title: "Sözcükte Anlam", completed: false },
            { title: "Cümlede Anlam", completed: false },
            { title: "Sözcük Türleri", completed: false },
            { title: "Sözcükte Yapı", completed: false },
            { title: "Cümlenin Ögeleri", completed: false },
            { title: "Cümle Türleri", completed: false },
            { title: "Dil Bilgisi Ses Olayları", completed: false },
            { title: "Yazım Kuralları", completed: false },
            { title: "Noktalama İşaretleri", completed: false },
            { title: "Anlatım Bozuklukları", completed: false },
            { title: "Paragrafta Anlam", completed: false },
            { title: "Paragrafta Anlatım Biçimi", completed: false },
            { title: "Sözel Mantık", completed: false }
        ]
    },
    {
        subject: "Matematik",
        topics: [
            { title: "Temel Kavramlar", completed: false },
            { title: "Sayılar- Ebob-Ekok", completed: false },
            { title: "Rasyonel Sayılar- Ondalıklı Sayılar", completed: false },
            { title: "Basit Eşitsizlikler", completed: false },
            { title: "Mutlak Değer", completed: false },
            { title: "Üslü Sayılar", completed: false },
            { title: "Köklü Sayılar", completed: false },
            { title: "Faktöriyel", completed: false },
            { title: "Çarpanlara Ayırma", completed: false },
            { title: "Oran- Orantı", completed: false },
            { title: "Denklem Çözme", completed: false },
            { title: "Sayı Problemleri", completed: false },
            { title: "Kesir Problemleri", completed: false },
            { title: "Yaş Problemleri", completed: false },
            { title: "İşçi ve Havuz Problemleri", completed: false },
            { title: "Hareket-Hız Problemleri", completed: false },
            { title: "Yüzde-Kar-Zarar Problemleri", completed: false },
            { title: "Karışım Problemleri", completed: false },
            { title: "Grafik Problemleri", completed: false },
            { title: "Kümeler ve Problemleri", completed: false },
            { title: "Fonksiyonlar", completed: false },
            { title: "İşlem", completed: false },
            { title: "Modüler Aritmetik", completed: false },
            { title: "Permütasyon", completed: false },
            { title: "Kombinasyon", completed: false },
            { title: "Olasılık", completed: false },
            { title: "Sayısal Mantık", completed: false },
            { title: "Şekil Yetenek", completed: false }
        ]
    },
    {
        subject: "Tarih",
        topics: [
            { title: "İslamiyet Öncesi Türk Tarihi", completed: false },
            { title: "İslamiyet Öncesi Türk Devletlerinde Kültür Medeniyet", completed: false },
            { title: "İlk Türk İslam Devletleri", completed: false },
            { title: "İlk Türk İslam Devletlerinde Kültür ve Medeniyet", completed: false },
            { title: "Osmanlı Devleti Kuruluş ve Yükselme Dönemi", completed: false },
            { title: "17. Yüzyıl Osmanlı Devleti Duraklama Dönemi", completed: false },
            { title: "18. Yüzyıl Osmanlı Devleti Gerileme Dönemi", completed: false },
            { title: "19. Yüzyıl Osmanlı Devleti Dağılma Dönemi", completed: false },
            { title: "20. Yüzyıl Osmanlı Devleti", completed: false },
            { title: "Osmanlı Devleti Kültür ve Medeniyet", completed: false },
            { title: "Milli Mücadele Dönemi", completed: false },
            { title: "İnkılap Tarihi", completed: false },
            { title: "Atatürk Dönemi İç ve Dış Politikalar", completed: false },
            { title: "Çağdaş Türk ve Dünya Tarihi", completed: false }
        ]
    },
    {
        subject: "Coğrafya",
        topics: [
            { title: "Türkiye’nin Coğrafi Konumu", completed: false },
            { title: "Türkiye’nin İklimi ve Bitki Örtüsü", completed: false },
            { title: "Türkiye’nin Fiziki Özellikleri", completed: false },
            { title: "Türkiye’de Nüfus ve Yerleşme", completed: false },
            { title: "Tarım", completed: false },
            { title: "Hayvancılık", completed: false },
            { title: "Madenler ve Enerji Kaynakları", completed: false },
            { title: "Sanayi ve Endüstri", completed: false },
            { title: "Ulaşım", completed: false },
            { title: "Ticaret", completed: false },
            { title: "Turizm", completed: false },
            { title: "Bölgeler Coğrafyası", completed: false }
        ]
    },
    {
        subject: "Vatandaşlık",
        topics: [
            { title: "Temel Hukuk Kavramları", completed: false },
            { title: "Anayasal Kavramlar", completed: false },
            { title: "Türk Anayasa Tarihi", completed: false },
            { title: "Temel Hak Ödevler", completed: false },
            { title: "Yasama", completed: false },
            { title: "Yürütme", completed: false },
            { title: "Yargı", completed: false },
            { title: "İdare Hukuku", completed: false }
        ]
    }
];

// Kaydedilen ilerlemeyi localStorage'da saklamak için kullanılacak anahtar
const progressKey = 'kpssProgress';

// localStorage'dan ilerleme verisini yükle, yoksa orijinal veriyi kullan
function loadProgress() {
    const saved = localStorage.getItem(progressKey);
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            // Güncellenmiş veri yapısını mevcut topicsData'ya uygula
            topicsData.forEach((subject, subjIndex) => {
                if (progress[subject.subject]) {
                    subject.topics.forEach((topic, topicIndex) => {
                        if (progress[subject.subject][topicIndex] !== undefined) {
                            topic.completed = progress[subject.subject][topicIndex];
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Progress yüklenirken hata:', e);
        }
    }
}

// Şu anki ilerlemeyi localStorage'a kaydet
function saveProgress() {
    const progress = {};
    topicsData.forEach(subject => {
        progress[subject.subject] = subject.topics.map(topic => topic.completed);
    });
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

// Sayfa yüklendiğinde ilerlemeyi yüklüyoruz
loadProgress();
