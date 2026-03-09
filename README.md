# Taşeron Hakediş Mobil Uygulaması

Taşeron hakediş takip ve yönetimi için geliştirilmiş kapsamlı mobil web uygulaması (PWA).

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

#### 📊 Dashboard ve Genel Bakış
- **Gerçek zamanlı istatistikler**: Aktif projeler, bekleyen onaylar, tamamlanan işler
- **Hızlı eylemler**: Sık kullanılan işlemlere kolay erişim
- **Son aktiviteler**: Güncel işlem geçmişi
- **Hava durumu entegrasyonu**: Saha çalışmaları için hava durumu bilgisi
- **Responsive tasarım**: Tüm cihazlarda mükemmel görünüm

#### 📝 Veri Girişi Sistemi
- **4 adımlı sihirbaz**: Proje seçimi → İş kalemi seçimi → Miktar girişi → Onay
- **Akıllı proje yönetimi**: Proje kartları ile görsel seçim
- **Dinamik iş kalemleri**: Projeye özel iş tanımları
- **Miktar kontrolleri**: Artırma/azaltma butonları ve doğrulama
- **Taslak kaydetme**: Yarım kalan işlemleri kaydetme
- **Şablon sistemi**: Hızlı veri girişi için önceden tanımlı şablonlar

#### 📸 Kalite Kontrol ve Fotoğraf Sistemi
- **Gelişmiş kamera entegrasyonu**: Ön/arka kamera desteği
- **Fotoğraf metadata'sı**: Otomatik konum, tarih ve iş bilgisi ekleme
- **Kalite puanlama**: 1-10 arası puanlama sistemi
- **Kontrol listesi**: 5 maddelik kalite kontrol listesi
- **Sorun takibi**: Tespit edilen sorunları kaydetme
- **Fotoğraf galerisi**: Çekilen fotoğrafları görüntüleme ve yönetme
- **Offline fotoğraf desteği**: İnternet olmadan fotoğraf çekme

#### ✅ Onay Sistemi
- **Dijital imza**: Canvas tabanlı imza sistemi
- **Onay zinciri**: Çok aşamalı onay süreci
- **Toplu onay**: Birden fazla öğeyi aynı anda onaylama
- **Red nedeni**: Detaylı red gerekçesi sistemi
- **Değişiklik talebi**: Düzeltme isteme özelliği
- **Onay geçmişi**: Tüm onay işlemlerinin kaydı
- **Acil onay**: Öncelikli onay sistemi

#### 🔔 Bildirim Sistemi
- **Push bildirimleri**: Gerçek zamanlı bildirimler
- **In-app bildirimler**: Uygulama içi bildirim sistemi
- **Bildirim türleri**: Hakediş, kalite, onay, ödeme bildirimleri
- **Ses ve titreşim**: Özelleştirilebilir bildirim sesleri
- **Bildirim geçmişi**: Tüm bildirimlerin kaydı
- **Akıllı filtreleme**: Bildirim türüne göre filtreleme

#### 📱 Offline Çalışma
- **Service Worker**: Gelişmiş offline desteği
- **Veri senkronizasyonu**: Otomatik arka plan senkronizasyonu
- **Offline kuyruk**: İnternet olmadan yapılan işlemleri kaydetme
- **Cache stratejileri**: Farklı içerik türleri için optimize edilmiş önbellekleme
- **Background sync**: Arka planda otomatik senkronizasyon

#### 🎨 Responsive Tasarım
- **Mobile-first**: Mobil cihazlar için optimize edilmiş
- **Tablet desteği**: Tablet cihazlar için özel düzenlemeler
- **Desktop uyumluluğu**: Masaüstü cihazlarda tam özellik desteği
- **Touch optimizasyonu**: Dokunmatik cihazlar için optimize edilmiş
- **Accessibility**: Erişilebilirlik standartlarına uygun

### 🛠️ Teknik Özellikler

#### 📱 Progressive Web App (PWA)
- **Offline çalışma**: Service Worker ile tam offline desteği
- **App-like deneyim**: Native uygulama hissi
- **Install edilebilir**: Ana ekrana ekleme desteği
- **Push bildirimleri**: Gerçek zamanlı bildirimler
- **Background sync**: Arka plan senkronizasyonu

#### 💾 Veri Yönetimi
- **IndexedDB**: Büyük veri depolama
- **LocalStorage**: Hızlı erişim için küçük veriler
- **Offline queue**: İnternet olmadan yapılan işlemler
- **Data encryption**: Hassas verilerin şifrelenmesi

#### 🔧 Geliştirici Araçları
- **Modüler yapı**: Bileşen tabanlı mimari
- **ES6+ JavaScript**: Modern JavaScript özellikleri
- **CSS Grid/Flexbox**: Modern CSS layout teknikleri
- **Responsive breakpoints**: Çoklu cihaz desteği

## 📁 Proje Yapısı

```
mobile_app/
├── index.html                 # Ana HTML dosyası
├── manifest.json             # PWA manifest
├── sw.js                     # Service Worker
├── README.md                 # Bu dosya
│
├── assets/                   # Statik dosyalar
│   ├── css/
│   │   ├── main.css         # Ana CSS dosyası
│   │   └── mobile.css       # Mobil-özel CSS
│   ├── icons/               # Uygulama ikonları
│   └── screenshots/         # Uygulama ekran görüntüleri
│
├── src/                     # Ana JavaScript dosyaları
│   ├── app.js              # Ana uygulama mantığı
│   ├── storage.js          # Veri depolama yönetimi
│   ├── notifications.js    # Bildirim sistemi
│   └── router.js           # Sayfa yönlendirme
│
├── components/             # Yeniden kullanılabilir bileşenler
│   ├── header.js          # Header bileşeni
│   ├── sidebar.js         # Sidebar bileşeni
│   └── modal.js           # Modal bileşeni
│
├── pages/                 # Sayfa bileşenleri
│   ├── dashboard.js       # Ana sayfa
│   ├── data-entry.js      # Veri girişi
│   ├── quality.js         # Kalite kontrol
│   └── approval.js        # Onay sistemi
│
└── data/                  # Örnek veriler
    └── sample-data.js     # Test verileri
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- HTTPS bağlantısı (PWA özellikleri için)
- Web sunucusu (geliştirme için)

### Yerel Geliştirme

1. **Dosyaları indirin**:
   ```bash
   # Proje dosyalarını yerel bilgisayarınıza kopyalayın
   ```

2. **Web sunucusu başlatın**:
   ```bash
   # Python ile basit sunucu
   python -m http.server 8000
   
   # Node.js ile
   npx serve .
   
   # PHP ile
   php -S localhost:8000
   ```

3. **Tarayıcıda açın**:
   ```
   http://localhost:8000
   ```

### Üretim Dağıtımı

1. **HTTPS gereksinimi**: PWA özellikleri için HTTPS gereklidir
2. **Service Worker**: sw.js dosyasının doğru yolda olduğundan emin olun
3. **Manifest**: manifest.json dosyasının erişilebilir olduğunu kontrol edin
4. **İkonlar**: Tüm ikon dosyalarının mevcut olduğunu doğrulayın

## 📱 Kullanım Kılavuzu

### İlk Kurulum
1. Uygulamayı tarayıcıda açın
2. "Ana ekrana ekle" seçeneğini kullanın (PWA kurulumu)
3. Bildirim izinlerini etkinleştirin
4. Kamera izinlerini verin (kalite kontrol için)

### Ana Özellikler

#### Dashboard
- **İstatistikler**: Güncel proje durumunu görüntüleyin
- **Hızlı eylemler**: Sık kullanılan işlemlere hızlı erişim
- **Son aktiviteler**: Güncel işlem geçmişini takip edin

#### Veri Girişi
1. **Proje seçin**: Çalışacağınız projeyi seçin
2. **İş kalemi seçin**: Yapılacak işi belirleyin
3. **Miktar girin**: İş miktarını girin
4. **Onaylayın**: Girişi tamamlayın

#### Kalite Kontrol
1. **İş kalemi seçin**: Kontrol edilecek işi seçin
2. **Fotoğraf çekin**: Kalite fotoğrafları çekin
3. **Puanlayın**: Kalite puanı verin (1-10)
4. **Kontrol listesi**: Kalite kriterlerini işaretleyin
5. **Rapor gönderin**: Kalite raporunu tamamlayın

#### Onay Sistemi
1. **Bekleyen onayları görüntüleyin**: Onay bekleyen öğeleri listeleyin
2. **Detayları inceleyin**: Onay detaylarını kontrol edin
3. **İmza atın**: Dijital imza ile onaylayın
4. **Toplu onay**: Birden fazla öğeyi aynı anda onaylayın

## 🔧 Özelleştirme

### Tema Değişiklikleri
CSS değişkenlerini düzenleyerek tema renklerini değiştirebilirsiniz:

```css
:root {
    --primary-color: #1F4E79;
    --secondary-color: #F39C12;
    --success-color: #27AE60;
    /* Diğer renkler... */
}
```

### Yeni Sayfa Ekleme
1. `pages/` klasörüne yeni JavaScript dosyası ekleyin
2. `src/router.js` dosyasına yeni rotayı ekleyin
3. Sidebar menüsüne yeni öğe ekleyin

### Bildirim Türleri
`src/notifications.js` dosyasında yeni bildirim türleri tanımlayabilirsiniz.

## 🐛 Sorun Giderme

### Yaygın Sorunlar

#### PWA Kurulumu Çalışmıyor
- HTTPS bağlantısı olduğundan emin olun
- Manifest.json dosyasının erişilebilir olduğunu kontrol edin
- Tarayıcı konsolunda hata mesajlarını kontrol edin

#### Bildirimler Çalışmıyor
- Bildirim izinlerinin verildiğini kontrol edin
- Service Worker'ın düzgün yüklendiğini doğrulayın
- HTTPS bağlantısı gereklidir

#### Kamera Açılmıyor
- Kamera izinlerini kontrol edin
- HTTPS bağlantısı gereklidir
- Cihazın kamera desteği olduğunu doğrulayın

#### Offline Çalışmıyor
- Service Worker'ın yüklendiğini kontrol edin
- Tarayıcı önbelleğini temizleyin
- IndexedDB desteğini kontrol edin

### Hata Ayıklama
1. **Tarayıcı Konsolu**: F12 ile geliştirici araçlarını açın
2. **Network Tab**: Ağ isteklerini kontrol edin
3. **Application Tab**: Service Worker ve storage durumunu kontrol edin
4. **Console Tab**: JavaScript hatalarını görüntüleyin

## 📊 Performans

### Optimizasyonlar
- **Lazy loading**: Sayfa bileşenleri ihtiyaç halinde yüklenir
- **Image optimization**: Fotoğraflar otomatik olarak optimize edilir
- **Caching**: Akıllı önbellekleme stratejileri
- **Minification**: CSS ve JavaScript dosyaları sıkıştırılmıştır

### Performans Metrikleri
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Güvenlik

### Veri Güvenliği
- **Local encryption**: Hassas veriler şifrelenir
- **HTTPS only**: Tüm iletişim şifreli
- **Input validation**: Tüm girişler doğrulanır
- **XSS protection**: Cross-site scripting koruması

### Gizlilik
- **Local storage**: Veriler cihazda saklanır
- **No tracking**: Kullanıcı takibi yapılmaz
- **Minimal permissions**: Sadece gerekli izinler istenir

## 🚀 Gelecek Özellikler

### Planlanan Geliştirmeler
- [ ] **QR kod tarama**: Malzeme ve ekipman takibi
- [ ] **GPS takip**: Saha çalışanları konum takibi
- [ ] **Çevrimdışı haritalar**: İnternet olmadan harita desteği
- [ ] **Sesli notlar**: Ses kaydı ile not alma
- [ ] **Barkod tarama**: Malzeme yönetimi
- [ ] **Rapor şablonları**: Özelleştirilebilir rapor formatları
- [ ] **Multi-language**: Çoklu dil desteği
- [ ] **Dark mode**: Karanlık tema seçeneği
- [ ] **Advanced analytics**: Detaylı analitik raporlar
- [ ] **Integration APIs**: Üçüncü parti sistem entegrasyonları

### Teknik İyileştirmeler
- [ ] **WebAssembly**: Performans kritik işlemler için
- [ ] **Web Workers**: Arka plan işlemleri
- [ ] **IndexedDB optimization**: Daha hızlı veri erişimi
- [ ] **PWA updates**: Otomatik uygulama güncellemeleri

## 📞 Destek

### İletişim
- **E-posta**: support@taseron-hakedis.com
- **Telefon**: +90 (212) 555-0123
- **Web**: https://taseron-hakedis.com

### Dokümantasyon
- **API Dokümantasyonu**: `/docs/api`
- **Kullanıcı Kılavuzu**: `/docs/user-guide`
- **Geliştirici Kılavuzu**: `/docs/developer-guide`

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

## 🙏 Teşekkürler

Bu projenin geliştirilmesinde katkıda bulunan herkese teşekkürler:

- **Tasarım**: Modern ve kullanıcı dostu arayüz tasarımı
- **Geliştirme**: Robust ve ölçeklenebilir kod yapısı
- **Test**: Kapsamlı test süreçleri
- **Dokümantasyon**: Detaylı kullanım kılavuzları

---

**Taşeron Hakediş Mobil Uygulaması** - İnşaat sektörü için modern, güvenilir ve kullanıcı dostu hakediş takip çözümü.

*Son güncelleme: Mart 2026*