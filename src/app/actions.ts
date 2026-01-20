"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LICENSE_COOKIE_EXPIRES_DAYS = 30;
export async function selectLicense(licenseSlug: string) {
  const cookieStore = await cookies();
  cookieStore.set("selected-license", licenseSlug, {
    path: "/",
    maxAge: 60 * 60 * 24 * LICENSE_COOKIE_EXPIRES_DAYS,
  });

  redirect(`/${licenseSlug}`);
}

export async function clearLicense() {
  const cookieStore = await cookies();
  cookieStore.delete("selected-license");

  redirect("/");
}
