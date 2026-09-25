/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/dispatch.html", destination: "/dispatch", permanent: false }];
  },
};

export default nextConfig;
