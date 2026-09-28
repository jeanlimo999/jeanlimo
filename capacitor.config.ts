import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jeanlimo.app",
  appName: "Jean Limo",
  webDir: "out",
  server: {
    url: "https://jeanlimo.com/app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
  },
};

export default config;
