import { INotificationChannel } from "../interfaces/iNotificationChannel";

export class EmailChannel extends InotificationChannel {
    async send (recipient, payload) {
        console.log(`Sending SMS to ${recipient}: ${payload.textBody}`);
        return { success: true, channel: "SMS" };
    }
}