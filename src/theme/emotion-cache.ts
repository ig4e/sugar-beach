import { createEmotionCache } from "@mantine/core";
import stylisRTLPlugin from "stylis-plugin-rtl";

export const mantineRtlCache = createEmotionCache({
  key: "mantine-rtl",
  stylisPlugins: [stylisRTLPlugin],
  prepend: false,
});

export const mantineLtrCache = createEmotionCache({
  key: "mantine-ltr",
  prepend: false,
});
