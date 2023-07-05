// eslint-disable-next-line @typescript-eslint/unbound-method

import { alertAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys); // eslint-disable-line @typescript-eslint/unbound-method

const baseStyle = definePartsStyle({
  container: {
    borderRadius: "lg",
  },
});

export const alertTheme = defineMultiStyleConfig({ baseStyle });
