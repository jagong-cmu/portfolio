import { build } from "velite";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here
};

// Velite integrates via a webpack plugin upstream, but Next 16 runs Turbopack,
// so we kick off the content build here instead — runs once when the config is
// evaluated, before bundling, independent of the bundler.
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  await build({ watch: isDev, clean: !isDev });
}

export default nextConfig;
