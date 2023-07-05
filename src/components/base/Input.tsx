import { Input as ChakraInput, InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const Input = forwardRef(function Input({ ...args }: InputProps, ref) {
  return (
    <ChakraInput
      focusBorderColor="pink.500"
      borderRadius={"lg"}
      {...args}
      ref={ref}
    />
  );
});

export default Input;
