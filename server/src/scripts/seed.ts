import { db } from '../config/firebase';

const seedData = async () => {
    console.log('🌱 Starting the Great Seed of the Altar...');

    try {
        // 1. Seed Events
        const events = [
            {
                title: "Wrestle Lagos",
                date: "March 27, 2026",
                time: "7:00 PM EST",
                description: "Join believers from over 30 nations for an all-night prayer vigil streaming live worldwide. Experience a night of intense intercession, worship, and spiritual warfare as we lift up the nation and the world.",
                location: "Lagos, Nigeria & Online",
                image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: 'ACTIVE',
                createdAt: new Date().toISOString()
            },
            {
                title: "Wrestle NYC",
                date: "March 22, 2026",
                time: "10:00 AM GMT",
                description: "A powerful service focused on healing prayers and spiritual restoration. Our team of ministers will lead a time of deep prayer for the body, mind, and soul, believing for miraculous breakthroughs.",
                location: "New York, USA & Online",
                image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                status: 'ACTIVE',
                createdAt: new Date().toISOString()
            }
        ];

        for (const event of events) {
            await db.collection('events').add(event);
        }
        console.log('✅ Events Seeded');

        // 2. Seed Prayers
        const prayers = [
            {
                name: "Grace M.",
                email: "grace@example.com",
                country: "Ghana",
                category: "Family",
                message: "Please pray for peace in my family. We are going through a difficult season.",
                status: 'PENDING',
                isPublic: true,
                prayerCount: 47,
                createdAt: new Date().toISOString()
            },
            {
                name: "Pastor John",
                email: "john@example.com",
                country: "USA",
                category: "Deliverance",
                message: "Pray for revival in our city. We believe God is about to move mightily.",
                status: 'APPROVED',
                isPublic: true,
                prayerCount: 120,
                createdAt: new Date().toISOString()
            }
        ];

        for (const prayer of prayers) {
            await db.collection('prayers').add(prayer);
        }
        console.log('✅ Prayers Seeded');

        // 3. Seed Testimonies
        const testimonies = [
            {
                name: "James O.",
                country: "Nigeria",
                message: "The Global Night of Prayer changed my life. I experienced a spiritual breakthrough that has transformed my family.",
                category: "Breakthrough",
                status: 'APPROVED',
                createdAt: new Date().toISOString()
            },
            {
                name: "Sarah K.",
                country: "Kenya",
                message: "I volunteered as an intercessor and my own prayer life has been transformed beyond measure. God is faithful!",
                category: "Growth",
                status: 'PENDING',
                createdAt: new Date().toISOString()
            }
        ];

        for (const test of testimonies) {
            await db.collection('testimonies').add(test);
        }
        console.log('✅ Testimonies Seeded');

        // 4. Seed Registrations
        const registrations = [
            {
                name: "Adeola Balogun",
                email: "adeola@example.com",
                city: "Lagos, Nigeria",
                status: 'CONFIRMED',
                createdAt: new Date().toISOString()
            }
        ];

        for (const reg of registrations) {
            await db.collection('registrations').add(reg);
        }
        console.log('✅ Registrations Seeded');

        console.log('🌈 Seed Mission Accomplished!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seed Mission Failed:', error);
        process.exit(1);
    }
};

seedData();
