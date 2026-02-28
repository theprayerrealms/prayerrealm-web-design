import nodemailer from 'nodemailer';
import { config } from '../config/db';

const transporter = nodemailer.createTransport({
    host: config.SMTP.HOST,
    port: config.SMTP.PORT,
    secure: config.SMTP.PORT === 465,
    auth: {
        user: config.SMTP.USER,
        pass: config.SMTP.PASS,
    },
});

interface DonationEmailData {
    to: string;
    donorName: string;
    amount: number;
    currency: string;
    isRecurring: boolean;
    provider: string;
    reference: string;
}

// Beautiful HTML email template for donation thank you
const buildThankYouEmail = (data: DonationEmailData): string => {
    const { donorName, amount, currency, isRecurring, reference } = data;
    const firstName = donorName.split(' ')[0] || 'Beloved';
    const formattedAmount = `${currency} ${amount.toLocaleString()}`;
    const donationType = isRecurring ? 'Monthly Partnership Seed' : 'One-Time Seed';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Generosity</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0a0a0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;">
        <!-- Header -->
        <tr>
            <td style="padding:40px 30px 20px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0a0a0c 100%);">
                <div style="font-size:32px;font-weight:900;letter-spacing:-1px;color:#ffffff;margin-bottom:4px;">
                    PRAYER<span style="color:#c8a45e;">REALM</span>
                </div>
                <div style="font-size:11px;letter-spacing:3px;color:#c8a45e;text-transform:uppercase;">
                    Global Ministry
                </div>
            </td>
        </tr>

        <!-- Gold Divider -->
        <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#c8a45e,transparent);"></td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding:40px 30px;background-color:#111114;">
                <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;font-weight:700;">
                    God Bless You, ${firstName}! 🙏
                </h1>
                <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin:0 0 25px;">
                    Your generous ${donationType.toLowerCase()} of <strong style="color:#c8a45e;">${formattedAmount}</strong> has been received. 
                    We are deeply grateful for your partnership in raising global altars of prayer across nations.
                </p>

                <!-- Receipt Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1a1a2e;border-radius:12px;border:1px solid rgba(200,164,94,0.2);margin-bottom:25px;">
                    <tr>
                        <td style="padding:24px;">
                            <div style="font-size:11px;letter-spacing:2px;color:#c8a45e;text-transform:uppercase;margin-bottom:16px;font-weight:700;">
                                Donation Receipt
                            </div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Amount</td>
                                    <td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${formattedAmount}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Type</td>
                                    <td style="padding:8px 0;color:#c8a45e;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${donationType}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Reference</td>
                                    <td style="padding:8px 0;color:#fff;font-size:12px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${reference}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;">Date</td>
                                    <td style="padding:8px 0;color:#fff;font-size:13px;text-align:right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                ${isRecurring ? `
                <!-- Monthly Notice -->
                <div style="background:rgba(200,164,94,0.08);border:1px solid rgba(200,164,94,0.2);border-radius:10px;padding:16px 20px;margin-bottom:25px;">
                    <div style="color:#c8a45e;font-size:13px;font-weight:700;margin-bottom:6px;">📅 Monthly Partnership Active</div>
                    <div style="color:#a0a0a0;font-size:12px;line-height:1.6;">
                        Your card has been securely authorized. <strong style="color:#fff;">${formattedAmount}</strong> will be automatically deducted each month. 
                        You will receive a confirmation email each time your seed is received. You can cancel your subscription at any time by contacting us.
                    </div>
                </div>
                ` : ''}

                <!-- Scripture -->
                <div style="text-align:center;padding:20px 0;margin-bottom:20px;">
                    <p style="color:#c8a45e;font-style:italic;font-size:14px;line-height:1.7;margin:0 0 8px;">
                        "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, 
                        will be poured into your lap."
                    </p>
                    <span style="color:#666;font-size:12px;">— Luke 6:38 (NIV)</span>
                </div>

                <!-- CTA -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="text-align:center;">
                            <a href="https://prayerrealm.com" 
                               style="display:inline-block;background:linear-gradient(135deg,#c8a45e,#a88b3e);color:#000;font-size:13px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                                Visit Prayer Realm
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding:30px;background-color:#080809;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="color:#555;font-size:11px;margin:0 0 8px;line-height:1.6;">
                    This email is a receipt for your donation to Prayer Realm International Ministry.
                </p>
                <p style="color:#444;font-size:10px;margin:0;">
                    © ${new Date().getFullYear()} Prayer Realm. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// Monthly recurring payment confirmation email
const buildMonthlyRenewalEmail = (data: DonationEmailData): string => {
    const { donorName, amount, currency, reference } = data;
    const firstName = donorName.split(' ')[0] || 'Beloved';
    const formattedAmount = `${currency} ${amount.toLocaleString()}`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Seed Received</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0a0a0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;">
        <tr>
            <td style="padding:40px 30px 20px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0a0a0c 100%);">
                <div style="font-size:32px;font-weight:900;letter-spacing:-1px;color:#ffffff;margin-bottom:4px;">
                    PRAYER<span style="color:#c8a45e;">REALM</span>
                </div>
                <div style="font-size:11px;letter-spacing:3px;color:#c8a45e;text-transform:uppercase;">
                    Monthly Partnership
                </div>
            </td>
        </tr>
        <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#c8a45e,transparent);"></td>
        </tr>
        <tr>
            <td style="padding:40px 30px;background-color:#111114;">
                <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;font-weight:700;">
                    Your Monthly Seed is Received! ✨
                </h1>
                <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin:0 0 25px;">
                    Dear ${firstName}, we are writing to confirm that your monthly partnership seed of 
                    <strong style="color:#c8a45e;">${formattedAmount}</strong> has been successfully processed. 
                    Thank you for your continued faithfulness!
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1a1a2e;border-radius:12px;border:1px solid rgba(200,164,94,0.2);margin-bottom:25px;">
                    <tr>
                        <td style="padding:20px 24px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding:6px 0;color:#888;font-size:13px;">Amount Received</td>
                                    <td style="padding:6px 0;color:#c8a45e;font-size:15px;font-weight:700;text-align:right;">${formattedAmount}</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0;color:#888;font-size:13px;">Reference</td>
                                    <td style="padding:6px 0;color:#fff;font-size:12px;text-align:right;">${reference}</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0;color:#888;font-size:13px;">Date</td>
                                    <td style="padding:6px 0;color:#fff;font-size:13px;text-align:right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div style="text-align:center;padding:16px 0;">
                    <p style="color:#c8a45e;font-style:italic;font-size:14px;line-height:1.7;margin:0 0 8px;">
                        "The Lord loves a cheerful giver."
                    </p>
                    <span style="color:#666;font-size:12px;">— 2 Corinthians 9:7</span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding:30px;background-color:#080809;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="color:#555;font-size:11px;margin:0 0 8px;">
                    To manage or cancel your monthly partnership, please contact us at support@prayerrealm.com
                </p>
                <p style="color:#444;font-size:10px;margin:0;">
                    © ${new Date().getFullYear()} Prayer Realm. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// Send Donation Thank You Email
export const sendDonationThankYou = async (data: DonationEmailData): Promise<void> => {
    try {
        const html = buildThankYouEmail(data);
        await transporter.sendMail({
            from: `"Prayer Realm" <${config.SMTP.FROM}>`,
            to: data.to,
            subject: data.isRecurring
                ? `🙏 Monthly Partnership Confirmed — ${data.currency} ${data.amount}`
                : `🙏 Thank You for Your Seed — ${data.currency} ${data.amount}`,
            html,
        });
        console.log(`[Email] Donation thank-you sent to ${data.to}`);
    } catch (error) {
        console.error('[Email] Failed to send donation thank-you:', error);
    }
};

// Send Monthly Renewal Confirmation Email
export const sendMonthlyRenewalConfirmation = async (data: DonationEmailData): Promise<void> => {
    try {
        const html = buildMonthlyRenewalEmail(data);
        await transporter.sendMail({
            from: `"Prayer Realm" <${config.SMTP.FROM}>`,
            to: data.to,
            subject: `✨ Monthly Seed Received — ${data.currency} ${data.amount}`,
            html,
        });
        console.log(`[Email] Monthly renewal confirmation sent to ${data.to}`);
    } catch (error) {
        console.error('[Email] Failed to send monthly renewal:', error);
    }
};

// ─── Volunteer Application Confirmation ─────────────────────

interface VolunteerEmailData {
    to: string;
    name: string;
    role: string;
}

const buildVolunteerConfirmationEmail = (data: VolunteerEmailData): string => {
    const firstName = data.name.split(' ')[0] || 'Beloved';
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0a0a0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;">
        <tr>
            <td style="padding:40px 30px 20px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0a0a0c 100%);">
                <div style="font-size:32px;font-weight:900;letter-spacing:-1px;color:#ffffff;margin-bottom:4px;">
                    PRAYER<span style="color:#c8a45e;">REALM</span>
                </div>
                <div style="font-size:11px;letter-spacing:3px;color:#c8a45e;text-transform:uppercase;">Volunteer Team</div>
            </td>
        </tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c8a45e,transparent);"></td></tr>
        <tr>
            <td style="padding:40px 30px;background-color:#111114;">
                <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;font-weight:700;">
                    Welcome to the Team, ${firstName}! 🎉
                </h1>
                <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin:0 0 25px;">
                    Thank you for stepping forward to serve with Prayer Realm! We have received your volunteer application 
                    and our team is reviewing it now.
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1a1a2e;border-radius:12px;border:1px solid rgba(200,164,94,0.2);margin-bottom:25px;">
                    <tr>
                        <td style="padding:24px;">
                            <div style="font-size:11px;letter-spacing:2px;color:#c8a45e;text-transform:uppercase;margin-bottom:16px;font-weight:700;">
                                Application Summary
                            </div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Name</td>
                                    <td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${data.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.05);">Preferred Role</td>
                                    <td style="padding:8px 0;color:#c8a45e;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid rgba(255,255,255,0.05);">${data.role}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;">Status</td>
                                    <td style="padding:8px 0;color:#4ade80;font-size:13px;font-weight:600;text-align:right;">Under Review ✓</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <div style="background:rgba(200,164,94,0.08);border:1px solid rgba(200,164,94,0.2);border-radius:10px;padding:16px 20px;margin-bottom:25px;">
                    <div style="color:#c8a45e;font-size:13px;font-weight:700;margin-bottom:6px;">📋 What Happens Next?</div>
                    <div style="color:#a0a0a0;font-size:12px;line-height:1.6;">
                        Our volunteer coordinator will review your application and reach out to you within <strong style="color:#fff;">3-5 business days</strong> 
                        with next steps, orientation details, and how you can start making an impact across nations.
                    </div>
                </div>

                <div style="text-align:center;padding:16px 0;">
                    <p style="color:#c8a45e;font-style:italic;font-size:14px;line-height:1.7;margin:0 0 8px;">
                        "For we are God's handiwork, created in Christ Jesus to do good works."
                    </p>
                    <span style="color:#666;font-size:12px;">— Ephesians 2:10</span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding:30px;background-color:#080809;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="color:#555;font-size:11px;margin:0 0 8px;">Questions? Reply to this email or contact us at info@prayerrealm.org</p>
                <p style="color:#444;font-size:10px;margin:0;">© ${new Date().getFullYear()} Prayer Realm. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export const sendVolunteerConfirmation = async (data: VolunteerEmailData): Promise<void> => {
    try {
        const html = buildVolunteerConfirmationEmail(data);
        await transporter.sendMail({
            from: `"Prayer Realm" <${config.SMTP.FROM}>`,
            to: data.to,
            subject: `🎉 Volunteer Application Received — Welcome, ${data.name.split(' ')[0]}!`,
            html,
        });
        console.log(`[Email] Volunteer confirmation sent to ${data.to}`);
    } catch (error) {
        console.error('[Email] Failed to send volunteer confirmation:', error);
    }
};

// ─── Contact Form Acknowledgement ───────────────────────────

interface ContactEmailData {
    to: string;
    name: string;
    subject: string;
}

const buildContactAcknowledgementEmail = (data: ContactEmailData): string => {
    const firstName = data.name.split(' ')[0] || 'Friend';
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#0a0a0c;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;">
        <tr>
            <td style="padding:40px 30px 20px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0a0a0c 100%);">
                <div style="font-size:32px;font-weight:900;letter-spacing:-1px;color:#ffffff;margin-bottom:4px;">
                    PRAYER<span style="color:#c8a45e;">REALM</span>
                </div>
                <div style="font-size:11px;letter-spacing:3px;color:#c8a45e;text-transform:uppercase;">Global Ministry</div>
            </td>
        </tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c8a45e,transparent);"></td></tr>
        <tr>
            <td style="padding:40px 30px;background-color:#111114;">
                <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px;font-weight:700;">
                    We Got Your Message, ${firstName}! 💌
                </h1>
                <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin:0 0 25px;">
                    Thank you for reaching out to Prayer Realm. We have received your message 
                    ${data.subject ? `regarding <strong style="color:#c8a45e;">"${data.subject}"</strong>` : ''} 
                    and our team will get back to you as soon as possible.
                </p>

                <div style="background:rgba(200,164,94,0.08);border:1px solid rgba(200,164,94,0.2);border-radius:10px;padding:16px 20px;margin-bottom:25px;">
                    <div style="color:#c8a45e;font-size:13px;font-weight:700;margin-bottom:6px;">⏰ Expected Response Time</div>
                    <div style="color:#a0a0a0;font-size:12px;line-height:1.6;">
                        We typically respond within <strong style="color:#fff;">24-48 hours</strong>. 
                        For urgent prayer requests, you can also visit our <strong style="color:#c8a45e;">Prayer Wall</strong> 
                        where our global community of intercessors will stand with you in prayer immediately.
                    </div>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="text-align:center;">
                            <a href="https://prayerrealm.com/prayer-wall" 
                               style="display:inline-block;background:linear-gradient(135deg,#c8a45e,#a88b3e);color:#000;font-size:13px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                                Visit Prayer Wall
                            </a>
                        </td>
                    </tr>
                </table>

                <div style="text-align:center;padding:24px 0 0;">
                    <p style="color:#c8a45e;font-style:italic;font-size:14px;line-height:1.7;margin:0 0 8px;">
                        "The prayer of a righteous person is powerful and effective."
                    </p>
                    <span style="color:#666;font-size:12px;">— James 5:16</span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding:30px;background-color:#080809;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
                <p style="color:#555;font-size:11px;margin:0 0 8px;">This is an automated confirmation. Please do not reply to this email.</p>
                <p style="color:#444;font-size:10px;margin:0;">© ${new Date().getFullYear()} Prayer Realm. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export const sendContactAcknowledgement = async (data: ContactEmailData): Promise<void> => {
    try {
        const html = buildContactAcknowledgementEmail(data);
        await transporter.sendMail({
            from: `"Prayer Realm" <${config.SMTP.FROM}>`,
            to: data.to,
            subject: `💌 We Received Your Message — Prayer Realm`,
            html,
        });
        console.log(`[Email] Contact acknowledgement sent to ${data.to}`);
    } catch (error) {
        console.error('[Email] Failed to send contact acknowledgement:', error);
    }
};
