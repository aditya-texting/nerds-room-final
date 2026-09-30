import { db } from './src/prisma/db.js';
let proto = Object.getPrototypeOf(db.orm.public.EventCategory);
console.log('EventCategory proto:', Object.getOwnPropertyNames(proto));
let query = db.orm.public.EventCategory.where({});
let queryProto = Object.getPrototypeOf(query);
console.log('Query proto:', Object.getOwnPropertyNames(queryProto));
