import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "../actions/auth";
import { createClient } from "@/lib/supabase";

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {session.user.email}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
