const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function uploadCSV(file: File): Promise<{ job_id: string; validation: unknown }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobStatus(jobId: string) {
  const res = await fetch(`${API_URL}/api/status/${jobId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobResults(jobId: string) {
  const res = await fetch(`${API_URL}/api/results/${jobId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function* streamChat(
  message: string,
  jobId: string | null,
  history: { role: string; content: string }[]
): AsyncGenerator<string> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, job_id: jobId, history }),
  });
  if (!res.ok) throw new Error(await res.text());
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
