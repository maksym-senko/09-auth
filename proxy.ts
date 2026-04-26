// proxy.ts
const proxy = {
  "/api": {
    target: "https://notehub-goit.vercel.app",
    changeOrigin: true,
  },
};

export default proxy;