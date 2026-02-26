import { Request, Response } from 'express';
import { User } from '../users/user.model';
import { PrayerRequest } from '../prayers/prayer.model';
import { Testimony } from '../testimonies/testimony.model';
import { VolunteerApplication } from '../volunteers/volunteer.model';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalUsers,
            pendingPrayers,
            pendingTestimonies,
            pendingApplications
        ] = await Promise.all([
            User.countDocuments(),
            PrayerRequest.countDocuments({ status: 'PENDING' }),
            Testimony.countDocuments({ status: 'PENDING' }),
            VolunteerApplication.countDocuments({ status: 'PENDING' })
        ]);

        res.json({
            totalUsers,
            pendingPrayers,
            pendingTestimonies,
            pendingApplications
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePrayerStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const prayer = await PrayerRequest.findByIdAndUpdate(id, { status }, { new: true });
        res.json(prayer);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
// Add more admin functions...
