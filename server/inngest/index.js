import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

//inngest functions will be added here
const syncUserFunction = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
        console.log("Syncing user from Clerk:", event.data);
        // Add your function logic here
    }
)

//inngest functions to deleted user
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.delete({
            where: {
                id: data.id
            }
        });
        console.log("Syncing user from Clerk:", event.data);
        // Add your function logic here
    }
)

//inngest functions will be update here
const syncUserUpdated = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { data } = event
        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
        console.log("Syncing user from Clerk:", event.data);
        // Add your function logic here
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserFunction, syncUserDeletion, syncUserUpdated];
