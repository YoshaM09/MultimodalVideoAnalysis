// import { createClient } from "@supabase/supabase-js";
// import { env } from "@/app/config/env";
// import { auth } from "@clerk/nextjs/server";
// import { headers } from "next/headers";

// export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);

// export async function getAuthenticatedSupabaseClient() {
//   const session = await auth();
//   const userId = session?.userId;

//   return createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY, {
//     global: {
//       headers: {
//         "clerk-user-id": userId || "",
//       },
//     },
//   });
// }
