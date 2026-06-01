# Daily Tracker — Setup & Deploy Guide

A mobile-first PWA. **No backend, no account, no setup.** Verileri telefonun tarayıcısında saklanır.

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind 4
- PWA (telefonun ana ekranına eklenir, tam ekran açılır)
- localStorage — tüm veriler bu cihazda kalır
- Vercel hosting (sadece linki yayına almak için)

---

## Tek yapacağın şey: Vercel'e deploy et (~5 dk)

### 1) GitHub repo oluştur ve kodu yükle

```bash
cd "/Users/toprak/Desktop/daily tracker"
git init
git add .
git commit -m "Initial commit"
```

GitHub.com'da yeni bir boş repo oluştur (örn. `daily-tracker`). Sonra:

```bash
git remote add origin https://github.com/SENIN-KULLANICI-ADIN/daily-tracker.git
git branch -M main
git push -u origin main
```

### 2) Vercel'e deploy et

1. [vercel.com](https://vercel.com) → GitHub ile giriş yap
2. **Add New → Project** → `daily-tracker` repo'sunu seç
3. Hiçbir şeyi değiştirme, sadece **Deploy** tıkla
4. ~1 dakika sonra sana bir URL verecek:  
   `https://daily-tracker-xxx.vercel.app`

**Hiç environment variable yok, hiç hesap yok.** Bitti.

---

## Telefona kurulum

### Android
1. URL'i **Chrome**'da aç
2. Sağ üstte ⋮ (üç nokta) → **Install app** veya **Add to Home screen**
3. Ana ekrana ikon gelir, tıklayınca tam ekran uygulama olarak açılır

### iPhone
1. URL'i **Safari**'de aç
2. Aşağıdaki paylaş butonuna bas → **Add to Home Screen**

---

## Kullanım

- **Routine** sekmesi — sabit haftalık programını gir (her Pzt 09:00 spor, vs.)
- **Events** sekmesi — belirli güne tek seferlik etkinlik ekle
- **Today** sekmesi — günün rutin + ekstra etkinlikleri birleşik gösterir
- **Tasks** — yapılacaklar listesi
- **Notes** — günlük notlar
- **Settings** → bildirim aç, yedek al/geri yükle

---

## ⚠️ Önemli: Veri Güvenliği

Veriler **sadece o telefonun tarayıcısında** saklanır. Eğer:
- Chrome geçmişini/sitelerin verisini silersen → veriler kaybolur
- Telefon değiştirirsen → yeni telefonda boş başlarsın
- Uygulamayı ana ekrandan kaldırırsan → veriler **kalır** (Chrome'da hâlâ duruyor)

### Çözüm: Düzenli yedek al

**Settings → Export backup** dediğinde bir `.json` dosyası iner.
- Bu dosyayı Google Drive / iCloud / mail'e kendine atabilirsin
- Sıfırdan başlasan bile **Import backup** ile geri yükleyebilirsin

Haftada bir yedek al, kafan rahat olsun.

---

## Local'de test (opsiyonel)

```bash
npm run dev
```
Tarayıcıda `http://localhost:3000` aç. Aynı şekilde çalışır.

---

## Sonradan bulut sync isteseniz?

Şu an her telefon kendi verisini tutuyor. Eğer ileride birden fazla cihazda aynı verilere erişmek istersen, Supabase/Firebase entegrasyonu eklenebilir — söyle, eklerim.
