import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type CookieStore = ReturnType<typeof cookies>;

interface CookieMethods {
  get(name: string): string | undefined;
  set(name: string, value: string, options: CookieOptions): void;
  remove(name: string, options: CookieOptions): void;
}

// Define the return type of our createClient function
export type TypedSupabaseClient = SupabaseClient;

export const createClient = (
  cookieStore?: CookieStore
): TypedSupabaseClient => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        persistSession: true,
        detectSessionInUrl: true,
        cookieOptions: {
          name: "sb-auth",
          // add other cookie options as needed
        },
      },
      cookies: {
        get(name: string) {
          return cookieStore?.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (cookieStore) {
            cookieStore.set({ name, value, ...options });
          }
        },
        remove(name: string, options: CookieOptions) {
          if (cookieStore) {
            cookieStore.set({ name, value: "", ...options });
          }
        },
      } as CookieMethods,
    }
  );
};
