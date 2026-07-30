import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { getSession } from "./lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  let isAuthorized = !!accessToken;
  let apiCookies: string[] | undefined;

  if (!isAuthorized && refreshToken) {
    try {
      const apiRes = await getSession();
      if (apiRes && apiRes.data) {
        isAuthorized = true;

        const setCookieHeader = apiRes.headers["set-cookie"];
        if (setCookieHeader) {
          apiCookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      }
    } catch {
      isAuthorized = false;
    }
  }

  let response: NextResponse;

  if (!isAuthorized && isPrivateRoute) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthorized && isPublicRoute) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  if (apiCookies) {
    for (const cookieStr of apiCookies) {
      const parsed = parseSetCookie(cookieStr);

      if (parsed && parsed.name && parsed.value) {
        response.cookies.set(parsed.name, parsed.value, {
          path: parsed.path,
          expires: parsed.expires,
          maxAge: parsed.maxAge,
          domain: parsed.domain,
          secure: parsed.secure,
          httpOnly: parsed.httpOnly,
          sameSite: parsed.sameSite as "strict" | "lax" | "none" | undefined,
        });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};