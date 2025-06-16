import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const body = await request.json()
    const data = body.data
    try {
        switch (body.type) {
            case "user.created":
                await prisma.user.create({
                    data: {
                        id: data.id,
                        username: data.username,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email_addresses[0].email_address,
                        createdAt: new Date(),
                        imageUrl: data.profile_image_url,
                    },
                });
                return NextResponse.json('User Successfully Created', { status: 200 });

            case 'user.updated':
                await prisma.user.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        username: data.username,
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email_addresses[0].email_address,
                        updatedAt: new Date(),
                        imageUrl: data.profile_image_url,
                    },
                });
                return NextResponse.json('User Successfully Updated', { status: 200 });

            case 'user.deleted':
                await prisma.user.delete({
                    where: {
                        id: data.id
                    },
                });
                return NextResponse.json('User Successfully Deleted', { status: 200 });
        };
    } catch (error) {
        return NextResponse.json('Failed to create user' + error, { status: 200 });
    };

    return NextResponse.json({ message: "Success", status: 200 });
};