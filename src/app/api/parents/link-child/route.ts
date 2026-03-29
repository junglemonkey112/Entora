import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const childEmail = (formData.get("child_email") as string | null)?.trim();

  if (!childEmail) {
    return NextResponse.redirect(new URL("/parents/dashboard?error=missing_email", request.url));
  }

  // Store child_email in user metadata
  await supabase.auth.updateUser({
    data: { ...user.user_metadata, child_email: childEmail },
  });

  return NextResponse.redirect(new URL("/parents/dashboard", request.url));
}
