"use server"

import { db } from "@/lib/db"

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string
  if (!email || !email.includes("@")) {
    return { error: "Invalid email address" }
  }

  try {
    await db.waitlistLead.create({
      data: { email }
    })
    return { success: true }
  } catch (err: any) {
    if (err.code === 'P2002') {
      return { error: "This email is already on the waitlist." }
    }
    return { error: "Something went wrong. Please try again." }
  }
}
