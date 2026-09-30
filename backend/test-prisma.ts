import { db } from './src/prisma/db.js';
console.log(Object.keys(db.orm.public));
console.log(Object.keys(db.orm.public.EventCategory));
