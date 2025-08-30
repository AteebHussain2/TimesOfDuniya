"use server"

import { cookies } from "next/headers"
import { createId } from "@paralleldrive/cuid2"

export async function getOrCreateGuestId(): Promise<string> {
  const cookieStore = await cookies()
  let guestId = cookieStore.get("tod_guest_id")?.value

  if (!guestId) {
    guestId = createId()
    // Set cookie for 30 days
    cookieStore.set("tod_guest_id", guestId, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return guestId
}
