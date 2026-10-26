import { INotificationChannel } from "../interfaces/iNotificationChannel";

export class EmailChannel extends InotificationChannel {
    async send (recipient, payload) {
        console.log(`Sending Email to ${recipient}: ${htmlMessage}`);
        return { success: true, channel: 'Email' };
    }
}