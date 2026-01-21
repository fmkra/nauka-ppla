import Cookies from "js-cookie";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const LICENSE_COOKIE_NAME = "selectedLicense";
const LICENSE_COOKIE_EXPIRES_DAYS = 365;

/**
 * Selects a license by setting a cookie and navigating to the license page
 * @param licenseUrl - The URL slug of the license (e.g., "ppla")
 * @param router - Next.js router instance for navigation
 */
export function selectLicense(
  licenseUrl: string,
  router: AppRouterInstance,
): void {
  Cookies.set(LICENSE_COOKIE_NAME, licenseUrl, {
    expires: LICENSE_COOKIE_EXPIRES_DAYS,
    path: "/",
  });

  router.push(`/${licenseUrl}`);
}

/**
 * Clears the selected license cookie
 */
export function clearLicenseCookie(): void {
  Cookies.remove(LICENSE_COOKIE_NAME, { path: "/" });
}
