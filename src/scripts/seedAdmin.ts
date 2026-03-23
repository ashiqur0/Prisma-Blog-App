import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/middleware";

async function seedAdmin() {
    try {
        const seedOrigin = process.env.APP_URL || "http://localhost:4000";

        const adminData = {
            name: 'Admin Saheb',
            email: 'admin@admin.com',
            role: UserRole.ADMIN,
            password: 'admin123'
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            throw new Error('User already exists in database');
        }

        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Better Auth rejects requests without an allowed Origin.
                'Origin': seedOrigin
            },
            body: JSON.stringify(adminData)
        });

        const responseBody = await signUpAdmin.text();
        console.log(`Sign-up status: ${signUpAdmin.status} ${signUpAdmin.statusText}`);

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
            console.log('Admin user seeded and email marked as verified.');
        } else {
            console.error('Seed failed response:', responseBody);
        }
        
    } catch (error) {
        console.error(error);
    }
}

seedAdmin();