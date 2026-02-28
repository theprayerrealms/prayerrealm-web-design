import { Request, Response } from 'express';
import { VolunteerApplication } from './volunteer.model';
import { sendVolunteerConfirmation } from '../../utils/email';

export const applyAsVolunteer = async (req: any, res: Response) => {
    try {
        const application = await VolunteerApplication.create({
            ...req.body,
            userId: req.user?._id
        });

        // Send confirmation email to the volunteer
        const { fullName, email, interests } = req.body;
        if (email) {
            await sendVolunteerConfirmation({
                to: email,
                name: fullName || 'Beloved',
                role: interests?.[0] || 'General Volunteer',
            });
        }

        res.status(201).json(application);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await VolunteerApplication.find().populate('userId', 'name email');
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
