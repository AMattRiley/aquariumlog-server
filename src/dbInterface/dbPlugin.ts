import { initDB, closeDB } from "./fetchDB";
export const DbPlugin =  {
    async serverWillStart() {
        const db = await initDB();
        return {
            async serverWillStop() {
                await closeDB(db);
            }
        }
    }
}