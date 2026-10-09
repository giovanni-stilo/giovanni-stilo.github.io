import { llmsTxt } from "@/lib/llms";

// Former location of the LLM guidance file; kept so existing links keep working.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
