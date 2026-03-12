import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

// Helper for random choice
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const TOUR_IMAGES = [
    "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Kapadokya
    "https://images.pexels.com/photos/2524368/pexels-photo-2524368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Deniz
    "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Doğa
    "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Şehir
    "https://images.pexels.com/photos/2105156/pexels-photo-2105156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3228766/pexels-photo-3228766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3389536/pexels-photo-3389536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const LOCATIONS = [
    { name: "Nevşehir, Kapadokya", lat: 38.6431, lng: 34.8289 },
    { name: "Muğla, Fethiye", lat: 36.6232, lng: 29.1164 },
    { name: "Rize, Ayder", lat: 40.9575, lng: 41.1035 },
    { name: "İstanbul, Boğaz", lat: 41.0082, lng: 28.9784 },
    { name: "Antalya, Kaş", lat: 36.2023, lng: 29.6341 },
    { name: "Denizli, Pamukkale", lat: 37.9137, lng: 29.1187 },
];

const CATEGORIES = [
    { name: "Kültür ve Tarih", slug: "kultur-ve-tarih", icon: "HistoryIcon" },
    { name: "Doğa ve Macera", slug: "doga-ve-macera", icon: "NatureIcon" },
    { name: "Yaz ve Deniz", slug: "yaz-ve-deniz", icon: "SeaIcon" },
    { name: "Kış Turizmi", slug: "kis-turizmi", icon: "SnowIcon" },
    { name: "Gastronomi", slug: "gastronomi", icon: "FoodIcon" },
];

const TITLES = [
    "Büyülü Kapadokya Balon Turu", "Fethiye Mavi Yolculuk", "Karadeniz Yayla Rüyası",
    "İstanbul Boğazı Özel Tekne Turu", "Kaş Dalış ve Tekne Turu", "Pamukkale Traverten Gezisi",
];

const DESCRIPTIONS = [
    "Unutulmaz bir tatil deneyimi için bize katılın. Her şey dahil konseptimizle rahatlayın.",
    "Doğanın kalbinde, eşsiz manzaralar eşliğinde harika bir kaçamak.",
    "Tarih ve kültür dolu bu turda medeniyetlerin izini sürüyoruz.",
];

export async function GET() {
    const p = prisma as any;
    try {
        // 1. CLEANUP
        await p.blogPost.deleteMany();
        await p.fAQ.deleteMany();
        await p.reservationPassenger.deleteMany();
        await p.reservation.deleteMany();
        await p.review.deleteMany();
        await p.favorite.deleteMany();
        await p.contactMessage.deleteMany();
        await p.siteSettings.deleteMany();
        await p.tourRoadmap.deleteMany();
        await p.tourExtra.deleteMany();
        await p.tourImage.deleteMany();
        await p.tour.deleteMany();
        await p.category.deleteMany();
        await p.agentProfile.deleteMany();
        await p.customerProfile.deleteMany();
        await p.user.deleteMany();

        // 0. CREATE SITE SETTINGS
        await p.siteSettings.create({
            data: {
                id: "global_settings",
                address: "İstanbul, Türkiye - Örnek Mahallesi, Turizm Sokak No: 10",
                email: "destek@venevtour.com",
                phone: "+90 (212) 123 45 67",
                facebook: "https://facebook.com/venevtour",
                twitter: "https://twitter.com/venevtour",
                instagram: "https://instagram.com/venevtour",
                linkedin: "https://linkedin.com/company/venevtour",
            }
        });

        const passwordHash = await hashPassword("123456");

        // 2. CREATE CATEGORIES
        const createdCategories = [];
        for (const cat of CATEGORIES) {
            const category = await p.category.create({
                data: {
                    ...cat,
                    image: random(TOUR_IMAGES)
                }
            });
            createdCategories.push(category);
        }

        // 3. CREATE ADMIN
        const admin = await p.user.create({
            data: {
                email: "admin@tour.com",
                passwordHash,
                role: "ADMIN",
                status: "ACTIVE",
            }
        });

        // 3.1 CREATE BLOG POSTS
        await p.blogPost.createMany({
            data: [
                {
                    title: "Kapadokya'da Balon Turu Hakkında Bilmeniz Gerekenler",
                    slug: "kapadokya-balon-turu-rehberi",
                    excerpt: "Eşsiz manzarasıyla Kapadokya'da gökyüzüne dokunmaya hazır mısınız?",
                    content: "Kapadokya balon turu, hayatınızda bir kez yaşamanız gereken eşsiz bir deneyimdir. Sabahın ilk ışıklarıyla havalanan yüzlerce balon, peri bacalarının üzerinden süzülürken size masalsı bir manzara sunar...",
                    image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
                    authorId: admin.id,
                    isActive: true
                },
                {
                    title: "Yaz Tatili İçin En İyi 5 Rota",
                    slug: "en-iyi-yaz-rotalari",
                    excerpt: "Deniz, kum ve güneşin tadını çıkarabileceğiniz en popüler tatil bölgeleri.",
                    content: "Bu yaz tatilinizi nerede geçireceğinize karar veremediniz mi? İşte sizin için seçtiğimiz en iyi 5 rota: Kaş, Fethiye, Bodrum, Alanya ve Marmaris...",
                    image: "https://images.pexels.com/photos/2524368/pexels-photo-2524368.jpeg",
                    authorId: admin.id,
                    isActive: true
                }
            ]
        });

        // 3.2 CREATE FAQS
        await p.fAQ.createMany({
            data: [
                {
                    question: "Rezervasyonumu nasıl iptal edebilirim?",
                    answer: "Rezervasyonunuzu tur tarihinden 48 saat öncesine kadar kesintisiz iptal edebilirsiniz. İptal talebiniz için panelinizden veya bizimle iletişime geçerek destek alabilirsiniz.",
                    order: 1,
                    isActive: true
                },
                {
                    question: "Ödeme yöntemleri nelerdir?",
                    answer: "Web sitemiz üzerinden kredi kartı, banka kartı ve PayPal ile güvenli ödeme yapabilirsiniz. Ayrıca acentelerimizle görüşerek havale/EFT seçeneklerini de değerlendirebilirsiniz.",
                    order: 2,
                    isActive: true
                },
                {
                    question: "Turlarımızda sigorta dahil mi?",
                    answer: "Evet, tüm paket turlarımızda zorunlu seyahat sigortası fiyata dahildir.",
                    order: 3,
                    isActive: true
                }
            ]
        });

        // 4. CREATE AGENTS
        const activeAgents = [];
        for (let i = 1; i <= 3; i++) {
            const agent = await p.user.create({
                data: {
                    email: `acente${i}@tour.com`,
                    passwordHash,
                    role: "AGENT",
                    status: "ACTIVE"
                }
            });

            // Separate Profile Creation to avoid nested validation issues if Client is out of sync
            await p.agentProfile.create({
                data: {
                    userId: agent.id,
                    companyName: `Turizm Acente ${i}`,
                    contactName: `Yetkili ${i}`,
                    contactPhone: "05551112233",
                    contactEmail: `info@acente${i}.com`,
                    tursabNumber: `TURSAB-${1000 + i}`,
                    bio: "Yılların deneyimi ile harika turlar sunuyoruz.",
                    commissionType: i % 2 === 0 ? "FIXED" : "PERCENTAGE",
                    commissionAmount: i % 2 === 0 ? 500 : 15
                }
            });
            activeAgents.push(agent);
        }

        // 5. CREATE CUSTOMERS
        const customers = [];
        for (let i = 1; i <= 5; i++) {
            const customer = await p.user.create({
                data: {
                    email: `musteri${i}@tour.com`,
                    passwordHash,
                    role: "CUSTOMER",
                    status: "ACTIVE"
                }
            });

            await p.customerProfile.create({
                data: {
                    userId: customer.id,
                    firstName: ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Can"][i - 1],
                    lastName: ["Yılmaz", "Demir", "Çelik", "Kaya", "Öztürk"][i - 1],
                    phone: `053211122${10 + i}`
                }
            });
            customers.push(customer);
        }

        // 6. CREATE TOURS
        const tours = [];
        for (let i = 0; i < 15; i++) {
            const agent = random(activeAgents);
            const category = random(createdCategories);
            const tourTitle = random(TITLES);
            const loc = random(LOCATIONS);
            const duration = randomInt(1, 5);

            const tour = await p.tour.create({
                data: {
                    agentId: agent.id,
                    categoryId: category.id,
                    title: `${tourTitle} - ${i + 1}`,
                    description: random(DESCRIPTIONS),
                    location: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                    languages: ["Türkçe", "İngilizce"],
                    priceFrom: randomInt(1500, 15000),
                    durationDays: duration,
                    maxCapacity: randomInt(10, 50),
                    tourStartDate: new Date("2026-02-17"),
                    tourEndDate: new Date("2026-03-22"),
                    includes: ["Konaklama", "Kahvaltı", "Transfer", "Rehber"],
                    excludes: ["Müze Girişleri", "Ekstra Harcamalar"],
                    images: {
                        createMany: {
                            data: [
                                { url: random(TOUR_IMAGES), isFeature: true },
                                { url: random(TOUR_IMAGES), isFeature: false },
                                { url: random(TOUR_IMAGES), isFeature: false },
                                { url: random(TOUR_IMAGES), isFeature: false },
                                { url: random(TOUR_IMAGES), isFeature: false },
                            ]
                        }
                    },
                    extras: {
                        createMany: {
                            data: [
                                { name: "VIP Transfer", price: 1500, isPerPerson: false },
                                { name: "Özel Fotoğrafçı", price: 800, isPerPerson: true }
                            ]
                        }
                    },
                    roadmaps: {
                        createMany: {
                            data: Array.from({ length: duration }).map((_, idx) => ({
                                dayNumber: idx + 1,
                                title: `${idx + 1}. Gün Programı`,
                                description: "Sabah panoramik şehir turu. Yerel restoranlarda tadım aktiviteleri ve serbest zaman."
                            }))
                        }
                    }
                }
            });
            tours.push(tour);

            // CREATE REVIEWS
            for (let j = 0; j < 2; j++) {
                await p.review.create({
                    data: {
                        tourId: tour.id,
                        userId: random(customers).id,
                        rating: randomInt(3, 5),
                        comment: "Harika bir deneyimdi, her şey çok iyi planlanmıştı!"
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Veritabanı en güncel şema ile sıfırlandı."
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Seed hatası.", error: String(error) }, { status: 500 });
    }
}
