export const usage = `import { GithubRelease } from "@/components/agent-ui/github-release";

<GithubRelease
  intent={{
    repo: "northwind/orders-svc",
    previousTag: "v3.7.4",
    suggestedTag: nextSuggestedSemver,
    title: agentTitle,
    notes: changelogFromCommits,
    targetCommitish: "main",
    prerelease: false,
    latest: true,
    assets: builtArtifacts,    // [{ name, size, contentType? }]
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      octokit.repos.createRelease({
        owner, repo,
        tag_name: r.payload.tag,
        name: r.payload.title,
        body: r.payload.notes,
        prerelease: r.payload.prerelease,
        make_latest: r.payload.latest ? "true" : "false",
        draft: r.payload.draft,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ReleaseIntent",                            req: true,  desc: "Repo, previous tag, suggested tag, title, notes, target commit, assets, flags." },
  { name: "onResult", type: "(r: ReviewResult<ReleasePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.previousTag", type: "string",                         req: true, desc: "Used to derive patch / minor / major bump suggestion chips." },
];
