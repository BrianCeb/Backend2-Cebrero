import ticketModel from "./models/ticketModel.js";

export class ticketDBManager {
    async createTicket(data) {
        return await ticketModel.create(data);
    }
}
