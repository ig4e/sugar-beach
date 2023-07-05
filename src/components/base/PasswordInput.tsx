import {
  Button,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Input from "~/components/Base/Input";

export default function PasswordInput({ ...args }: InputProps) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        {...args}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? (
            <EyeSlashIcon className="h-5 w-5"></EyeSlashIcon>
          ) : (
            <EyeIcon className="h-5 w-5"></EyeIcon>
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
