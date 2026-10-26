export class AlertRepository {
    async save(sensorData) {
        console.log(`INSERT INTO alerts (sensor_id, reading, reading) VALUES (${sensorData.id}, ${sensorData.reading})`);
        return { id: Data.now(), sensorData, savedAt: new Date() };
    }
}