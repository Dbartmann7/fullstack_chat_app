import { Pool } from "pg";

export const pool:Pool = new Pool({
    host:"localhost",
    port:5432,
    user:"postgres",
    password:process.env.DB_PASS,
    database:"ChatDB"
});
