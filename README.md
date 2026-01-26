# 🧠 TUR PROJESİ (MVP) — Next.js + Prisma + Docker (PostgreSQL + Adminer) — Türkçe Tam Sistem Geliştirme Promptu

Aşağıdaki talimatları **tek tek sırayla** uygula.  
Bu proje bir **Tur / Rezervasyon Sistemi MVP’si** olacak ve **tamamen Türkçe** çalışacak (UI, içerikler, e-postalar/mesajlar, form alanları, validation metinleri, hata mesajları dahil).  
Amaç: **MVP seviyesinde tam çalışan bir sistem** üretmek: sayfalar + API + Prisma şeması + rol bazlı kullanıcı panelleri.

---

## ✅ 1) Proje Genel Kapsamı

### Proje Tipi
- Tur arama / listeleme / detay inceleme
- Rezervasyon oluşturma (yolcu bilgileri + extra hizmetler)
- Kullanıcı hesap yönetimi (Admin / Acente(Agent) / Müşteri(Customer))
- Favoriler sistemi
- Adminer ile DB yönetimi
- Docker ile local ortam

### Teknoloji Stack
- Next.js (App Router)
- Next.js API Routes (Route Handlers) → `src/app/api/**`
- Prisma (ORM) + Prisma Client
- PostgreSQL (Docker)
- Adminer (Docker)
- TailwindCSS (hazır tasarım şeması var, uyumlu ilerle)
- Auth sistemi (session/JWT tercihine göre MVP)
- TypeScript

> Proje içinde backend ayrı değil: **backend tamamen Next.js içinde API olarak** yazılacak.

---

## ✅ 2) Kullanıcı Rolleri ve Yetkilendirme

Sistem 3 rol içerecek:
1. **Admin**
2. **Acente (Agent)**
3. **Müşteri (Customer)**

### Rol Bazlı Erişim
- Her kullanıcı **giriş yaptıktan sonra** `/account` sayfasına gider.
- `/account` içeriği kullanıcı rolüne göre **tamamen farklı UI + menü** göstermeli.
- Admin paneli MVP’de **minimal** olacak (çok genişletme).
- Acente paneli daha dolu ve işlevsel olacak.
- Müşteri paneli rezervasyon odaklı olacak.

---

## ✅ 3) Auth (Giriş / Kayıt) Kuralları

### Kayıt Türleri Ayrı Olmalı
✅ **Acente Kaydı** ayrı sayfa + ayrı form  
✅ **Müşteri Kaydı** ayrı sayfa + ayrı form

#### Müşteri Kaydı Alanları (MVP)
- Ad
- Soyad
- E-posta
- Telefon
- Şifre
- KVKK / üyelik sözleşmesi onayı

#### Acente Kaydı Alanları (MVP + “resmi acente bilgileri” formatlı)
Acente kaydı ekranı bir tur acentesinin sahip olabileceği standart bilgilerle formlaştırılmalı:

**Temel Bilgiler**
- Acente Ticari Ünvanı
- Yetkili Ad Soyad
- Yetkili Telefon
- Yetkili E-posta
- Şifre

**Şirket Bilgileri**
- Vergi Dairesi
- Vergi Numarası
- Şirket Türü (Ltd, AŞ, Şahıs vb.)
- Şirket Adresi (il/ilçe/açık adres)
- Fatura Adresi (opsiyonel ayrı)
- IBAN / ödeme bilgisi (opsiyonel MVP)

**Turizm Yetki / Belge Bilgileri (MVP)**
- TURSAB Belge Numarası (zorunlu)
- Belge Fotoğrafı / Dosya Yükleme (MVP’de base64 veya dosya linki)
- Ticaret Sicil Numarası (opsiyonel)
- Web sitesi (opsiyonel)
- Sosyal medya (opsiyonel)

**Onay/Doğrulama**
- “Başvuru gönderildi, admin onayı bekleniyor” akışı olmalı
- Acente hesabı ilk etapta `PENDING` statüsünde oluşturulmalı
- Admin onaylarsa `ACTIVE` olur, reddederse `REJECTED`
- Acente aktif değilse tur oluşturamaz

✅ Acente kayıt işlemi sonunda: “Başvurunuz alınmıştır, incelendikten sonra aktif edilecektir.” gibi Türkçe bilgilendirme göster.

---

## ✅ 4) Sayfa Yapısı (UI Türkçe Olacak)

### Genel Public Sayfalar (MVP)
1. **Anasayfa**
2. **Turlar** (detaylı arama + filtreleme sayfası)
3. **Tur Arama** (küçük arama ekranı veya modal)
4. **Anasayfa Hero Tur Arama** (anasayfa üst kısmında büyük arama)
5. **Tur Detay Sayfası**
6. **Tur Detaydan Rezervasyon Oluşturma**
   - yolcu bilgileri
   - ekstra hizmetler
   - ödeme yok (MVP: “rezervasyon talebi oluşturuldu”)
7. **Hesap Yönetimi**
   - `/account` ana panel
   - rol bazlı alt sayfalar

---

## ✅ 5) Panel Sayfaları ve Menüleri

### Acente Paneli (`/account/agent/**`)
- **Analizler ve Raporlar** (MVP: temel kartlar + dummy chart)
- **Tur Yönetimi**
  - Tur listesi
  - Tur oluştur
  - Tur düzenle
  - Tur pasife al / sil
- **Profil Yönetimi**
  - acente bilgilerini güncelle
  - belge bilgisi
- **Favoriler**
  - acentenin favorilediği turlar (isterse)
- **Raporlar** (rezervasyon raporu, talep raporu)

### Müşteri Paneli (`/account/customer/**`)
- **Rezervasyonlarım**
  - durumlar: Pending/Approved/Cancelled
- **Favoriler**
- **Profil Yönetimi**
  - ad/soyad/telefon/email güncelle
  - şifre değiştir

### Admin Paneli (`/account/admin/**`) — MVP Minimal
- Kullanıcı listeleme (acente başvuruları)
- Acente onaylama / reddetme (temel)
- Basit dashboard kartları

---

## ✅ 6) Tasarım ve UX Kuralları

- Sistem Tailwind ile yazıldı, mevcut tasarım şemasına uyumlu ilerle.
- UI/UX çok temiz olmalı:
  - Modern kart yapıları
  - Boş state’ler (ör: “Henüz favoriniz yok”)
  - Loading state
  - Error state
- Metinler ve butonlar tamamen Türkçe:
  - “Rezervasyon Oluştur”
  - “Turu Favorilere Ekle”
  - “Filtreleri Uygula”
  - “Giriş Yap”
  - “Kayıt Ol”
- Responsive tasarım (mobil / tablet / desktop)

---

## ✅ 7) Dinamikleşecek Sayfaları Tarayarak Prisma Şeması Çıkarma

⚠️ PROJEDE EN ÖNEMLİ KURAL:
Önce sayfaları ve akışları analiz edip **dinamik olanları belirle**.  
Sonra bu sayfalara göre **Prisma şeması çıkar**.  
Ardından API yaz.  
Sonra yazdığın API’yi ilgili sayfaya bağla.

Bu sırayı asla bozma.

### Dinamik Olacak İçerikler (MVP)
- Kullanıcılar (admin/agent/customer)
- Acente başvuruları + statüler
- Turlar
- Tur görselleri
- Tur tarihleri (opsiyonel)
- Rezervasyonlar
- Rezervasyon yolcuları
- Extralar (tur ekstra hizmetleri)
- Favoriler
- Şehir/ülke listeleme (opsiyonel)
- Kategori sistemi (opsiyonel)

---

## ✅ 8) Veritabanı Modelleri (Prisma Şeması Beklentisi)

Aşağıdaki ana entity’leri kullanarak Prisma şemasını tasarla (MVP odaklı):

### Zorunlu Modeller
- User
- AgentProfile (Acente detay bilgileri)
- CustomerProfile (Müşteri detay bilgileri)
- Tour
- TourImage
- TourExtra (tur için ekstra hizmet)
- Reservation
- ReservationPassenger
- Favorite

### Önemli Alanlar (Örnek)
- User:
  - id, email, passwordHash
  - role: ADMIN | AGENT | CUSTOMER
  - status: ACTIVE | PENDING | REJECTED
  - createdAt
- Tour:
  - title, description
  - location (şehir/ülke)
  - priceFrom
  - durationDays
  - capacity
  - includes/excludes (MVP string list)
  - agentId (owner)
  - isActive
- Reservation:
  - tourId
  - customerId
  - status: PENDING | CONFIRMED | CANCELLED
  - totalPrice (MVP hesapla)
- Passengers:
  - fullName, gender, birthDate, nationality, passportNo (opsiyonel)
- Extras:
  - title, price, perPerson boolean

---

## ✅ 9) API Tasarımı (Next.js API Routes)

API’ler Next.js içinde olacak:

`src/app/api/**`

### Auth API
- `POST /api/auth/register-customer`
- `POST /api/auth/register-agent`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tours API
- `GET /api/tours` (search + filter + pagination)
- `GET /api/tours/:id`
- `POST /api/tours` (agent only)
- `PUT /api/tours/:id` (agent owner only)
- `DELETE /api/tours/:id` (soft delete / inactive)

### Favorites API
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:tourId`

### Reservations API
- `POST /api/reservations` (create from tour detail)
- `GET /api/reservations/my` (customer)
- `GET /api/reservations/agent` (agent reservations for own tours)

### Admin API (MVP)
- `GET /api/admin/agents/pending`
- `POST /api/admin/agents/:agentId/approve`
- `POST /api/admin/agents/:agentId/reject`

API cevapları Türkçe mesaj içerebilir:
- `{ success: true, message: "Rezervasyon oluşturuldu", data: ... }`

---

## ✅ 10) Önemli Public Sayfalar (MVP) ve Data Bağlantıları

Aşağıdaki sayfaları hem Türkçeleştir hem MVP API ile bağla:

### 1) Anasayfa
- Hero bölümünde “Tur Ara” formu olacak:
  - Lokasyon
  - Tarih (opsiyonel)
  - Kişi sayısı (opsiyonel)
- Popüler turlar bölümü (API’den çek)

### 2) Turlar Sayfası (detaylı arama + filtreleme)
Filtreler (MVP):
- Lokasyon
- Fiyat aralığı (min-max)
- Süre (1-3 gün, 4-7 gün vb.)
- Acente (opsiyonel)
- Arama keyword (başlık/konum)

Bu sayfa `GET /api/tours` ile çalışmalı.

### 3) Tur Detay Sayfası
- Tur bilgileri
- Galeri
- Ekstra hizmetler listesi
- “Rezervasyon Oluştur” CTA

`GET /api/tours/:id`

### 4) Tur Detaydan Rezervasyon Create
- Form:
  - Yolcu sayısı
  - Yolcu bilgileri (her yolcu için inputlar)
  - Extra seçimleri (checkbox)
  - Toplam fiyat hesaplaması
- Submit:
  - `POST /api/reservations`
- Başarılı olursa:
  - “Rezervasyon talebiniz alındı” Türkçe mesaj
  - Kullanıcıyı `/account/customer/reservations` sayfasına yönlendir

### 5) Hesap Yönetimi (/account)
- Giriş yapılmadıysa login’e yönlendir
- Role göre farklı layout:
  - `/account/customer/**`
  - `/account/agent/**`
  - `/account/admin/**`

---

## ✅ 11) Docker Kurulumu (Postgres + Adminer)

Docker Compose olacak:
- `postgres` container
- `adminer` container

Adminer:
- UI Türkçe değilse sorun değil, ama proje UI Türkçe olacak

---

## ✅ 12) MVP İçin Adım Adım Yapılacaklar (Şart)

Bu projeyi geliştirirken **adım adım ilerleyeceksin** ve her adımda:

1. Hangi sayfalar dinamik olacak? (tarayıp listele)
2. Buna göre Prisma şemasını çıkar
3. Migration çalıştır
4. API endpoint’leri yaz
5. İlgili sayfaya API’yi bağla
6. UI’ı Türkçeleştir ve boş/loading/error state ekle
7. Bitince TODO listesinden tikle ✅

Her adım bittikten sonra **checklist şeklinde ilerle**.

---

## ✅ 13) Tam Beklenti: “Çalışan MVP”

Proje sonunda şunlar çalışıyor olmalı:

✅ Türkçe public site (anasayfa, turlar, tur detay)  
✅ Tur arama + filtreleme  
✅ Tur detaydan rezervasyon oluşturma  
✅ Müşteri kayıt + giriş + profil + rezervasyonlarım  
✅ Acente kayıt (belgeli) + giriş + tur yönetimi (CRUD)  
✅ Favoriler sistemi  
✅ Admin onay akışı (acente pending→active)  
✅ Prisma + PostgreSQL + Docker  
✅ Next.js API + Prisma ile tam entegre  
✅ `/account` rol bazlı panel ve menüler  

---

## ✅ 14) Kod Kalitesi Kuralları

- TypeScript strict yaklaş
- Input validation (Zod önerilir)
- API error handling standardize:
  - `400` validation error
  - `401` unauthorized
  - `403` forbidden
  - `404` not found
  - `500` server error
- Güvenlik:
  - şifre hash (bcrypt)
  - role check middleware/helper
- Prisma sorguları optimizasyonlu olmalı (include/select kullan)

---

## ✅ 15) Final İstek (Özet)

Bu projeyi **tamamen MVP olarak bitir**:  
- Önce dinamik sayfaları tarayıp şema çıkar  
- Prisma schema + migrate  
- Next.js API yaz  
- UI sayfalarını Türkçe yap  
- API’leri sayfalara bağla  
- Adım adım checklist ile ilerle  
- Her modül bittiğinde “✅ tamamlandı” diye tikle  

ASLA AMA ASLA HİÇBİR KOMUT ÇALIŞTIRMA SADECE KOD YAZ VE EN SON YAZILMASI GEREKEN KOMUTLARI BİR DOSYADA VER. BEN CALISTIRICAM DAHA SONRA.

Başla.
