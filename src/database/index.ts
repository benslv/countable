/* eslint-disable @typescript-eslint/no-explicit-any */
import Enmap from "enmap";

export const db = {
  settings: new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
  }),
  debug: function (): Enmap<string | number, any> {
    return this.settings;
  },
};
