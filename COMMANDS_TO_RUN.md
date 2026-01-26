# Komut Listesi

Lütfen aşağıdaki komutları sırasıyla çalıştırın. Bu komutlar gerekli paketleri kuracak ve veritabanını hazırlayacaktır.

## 1. Paket Kurulumu (Encryption için)
```bash
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

## 2. Docker Ortamını Başlatma
```bash
docker-compose up -d
```

## 3. Prisma Veritabanı Senkronizasyonu
```bash
npx prisma generate
npx prisma db push
```

## 4. Projeyi Başlatma
```bash
npm run dev
```
