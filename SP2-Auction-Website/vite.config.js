import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),

        login: resolve(__dirname, "account/login.html"),
        register: resolve(__dirname, "account/register.html"),
        profile: resolve(__dirname, "account/profile.html"),

        auctions: resolve(__dirname, "auctions/auctions.html"),
        auction: resolve(__dirname, "auctions/auction.html"),

        create: resolve(__dirname, "listings/create.html"),
        edit: resolve(__dirname, "listings/edit.html"),
      },
    },
  },
});

