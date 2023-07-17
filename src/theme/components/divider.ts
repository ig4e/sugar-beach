import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const thick = defineStyle({
  borderWidth: "5px", // change the width of the border
  borderStyle: "solid", // change the style of the border
  borderRadius: 10, // set border radius to 10
});

export const dividerTheme = defineStyleConfig({
  baseStyle: {
    borderWidth: "1px",
    borderColor: "gray.300",
    borderRadius: "xl", // set border radius to 10
  },
});
