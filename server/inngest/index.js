// { event: 'clerk/user.deleted' } => ini salah

import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

//inngest functions will be added here
const syncUserFunction = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: "webhook-integration/user.created" },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
        // Add your function logic here
    }
)

//inngest functions to deleted user
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'webhook-integration/user.deleted' },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            data: {
                where: { id: data.id }
            }
        });
        // Add your function logic here
    }
)

//inngest functions will be update here
const syncUserUpdated = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'webhook-integration/user.updated' },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            where: { id: data.id },
            data: {
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
        // Add your function logic here
    }
)

//Inngest func to save workspace data to database
const syncWorkspaceCreation = inngest.createFunction(
    { id: 'sync-workspace-with-clerk' },
    { event: 'webhook-integration/organization.created' },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url,
            }
        });

        // Add creator as Admin Member
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: 'ADMIN',
            }
        });
        // Add your function logic here
    }
)

//Inngest func to update workspace data to database
const syncWorkspaceUpdate = inngest.createFunction(
    { id: 'update-workspace-with-clerk' },
    { event: 'webhook-integration/organization.updated' },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.update({
            where: { id: data.id },
            data: {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
            }
        });
        // Add your function logic here
    }
)


//Inngest func to Delete workspace data to database
const syncWorkspaceDeletion = inngest.createFunction(
    { id: 'delete-workspace-with-clerk' },
    { event: 'webhook-integration/organization.deleted' },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.delete({
            where: { id: data.id }
        });
        // Add your function logic here
    }
)

//Inngest func to save workspace member data  to database
const syncWorkspaceMemberCreation = inngest.createFunction(
    { id: 'sync-workspace-member-with-clerk' },
    { event: 'webhook-integration/organizationInvitation.accepted' },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase(),
            }
        });
        // Add your function logic here
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserFunction, syncUserUpdated, syncUserDeletion, syncWorkspaceCreation, syncWorkspaceUpdate, syncWorkspaceDeletion, syncWorkspaceMemberCreation];
