# Hata Giderme Adımları

Görülen hata (`Cannot read properties of undefined (reading 'findMany')`), Prisma 7'nin yerel veritabanı bağlantısı için bir "Driver Adapter" gerektirmesinden veya Client yapılandırmasının eksik olmasından kaynaklanıyor.

Kod tarafını düzelttim (`src/lib/prisma.ts`), ancak gerekli paketlerin (Adapter) yüklenmesi gerekiyor.

Lütfen aşağıdaki komutu terminalde çalıştırın:

```bash
npm install pg @prisma/adapter-pg
npm install -D @types/pg
npx prisma generate
```

Bu işlemden sonra `npm run dev` komutunu durdurup tekrar başlatırsanız sorun çözülecektir.
