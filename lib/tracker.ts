type NewTask = {
  title: string;
  body: string;
  owner: string | null;
};

/** Where confirmed tasks will go, in words a user can read. */
export function trackerLabel(): string {
  const repo = process.env.GITHUB_REPO;
  if (process.env.GITHUB_TOKEN && repo && repo.includes("/")) return `GitHub issues in ${repo}`;
  return "the demo tracker (no GitHub connected)";
}

let mockCounter = 0;

function mockTask(): string {
  mockCounter += 1;
  return `mock:${Date.now()}-${mockCounter}`;
}

/**
 * Creates a GitHub issue when GITHUB_TOKEN and GITHUB_REPO are set.
 * Falls back to a mock task (a "mock:" id) so the demo never depends on the network.
 */
export async function createTask(task: NewTask): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo || !repo.includes("/")) return mockTask();

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "followthrough-hackathon",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        body: task.body,
        labels: task.owner ? [`owner:${task.owner}`] : [],
      }),
    });
    if (!res.ok) {
      console.error("GitHub issue creation failed:", res.status, await res.text());
      return mockTask();
    }
    const data = (await res.json()) as { html_url?: string };
    return data.html_url ?? mockTask();
  } catch (err) {
    console.error("GitHub issue creation error:", err);
    return mockTask();
  }
}
