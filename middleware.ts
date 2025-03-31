import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = {
            name,
            value,
            ...options,
          };

          request.cookies.set(cookieOptions);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(cookieOptions);
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions = {
            name,
            value: "",
            ...options,
          };

          request.cookies.set(cookieOptions);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(cookieOptions);
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
