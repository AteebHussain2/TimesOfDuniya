import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

    if (!privateKey || !publicKey) {
        throw new Error("Missing ImageKit credentials");
    }

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: privateKey as string,
        publicKey: publicKey as string,
        // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
        // token: "random-token", // Optional, a unique token for request
    });

    return Response.json({ token, expire, signature, publicKey })
}
