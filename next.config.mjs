await import("./lib/env.mjs")
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPlausibleProxy()(nextConfig);
