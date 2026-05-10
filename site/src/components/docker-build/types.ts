import type { AgentMeta } from "../../types";

export type DockerBuildArg = { key: string; value: string; secret?: boolean };

export type DockerPlatform = "linux/amd64" | "linux/arm64" | "linux/arm/v7" | "darwin/amd64" | "darwin/arm64";

export type DockerStage = {
  name: string;
  baseImage: string;
};

export type DockerIntent = AgentMeta & {
  imageName: string;
  imageTag: string;
  dockerfile: string;
  contextDir: string;
  buildArgs: DockerBuildArg[];
  stages: DockerStage[];
  targetStage?: string;
  platforms: DockerPlatform[];
  noCache?: boolean;
  push?: boolean;
  registry?: string;
};

export type DockerPayload = {
  imageName: string;
  imageTag: string;
  dockerfile: string;
  contextDir: string;
  buildArgs: DockerBuildArg[];
  targetStage?: string;
  platforms: DockerPlatform[];
  noCache: boolean;
  push: boolean;
};

export const DOCKER_DEFAULT: DockerIntent = {
  agent: "atlas",
  action: "docker-build",
  imageName: "northwind/orders-svc",
  imageTag: "v3.8.0",
  dockerfile: "./Dockerfile",
  contextDir: ".",
  buildArgs: [
    { key: "GIT_SHA",         value: "a1b2c3d" },
    { key: "BUILD_TIME",      value: "2026-05-10T14:00:00Z" },
    { key: "NPM_TOKEN",       value: "***",  secret: true },
  ],
  stages: [
    { name: "deps",     baseImage: "node:20-alpine" },
    { name: "builder",  baseImage: "node:20-alpine" },
    { name: "runner",   baseImage: "gcr.io/distroless/nodejs20-debian12" },
  ],
  targetStage: "runner",
  platforms: ["linux/amd64", "linux/arm64"],
  noCache: false,
  push: true,
  registry: "ghcr.io",
  rationale: "Multi-arch image for the staging deploy. Distroless runner stage is the right target for prod; pinned base SHA in the Dockerfile.",
};
