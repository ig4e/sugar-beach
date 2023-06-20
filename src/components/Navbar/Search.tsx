import { SearchIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Input from "../base/Input";
import { useRouter } from "next/router";

function Search() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/search?query=${e.currentTarget.search.value}`);
  }

  return (
    <form className="relative hidden w-full md:flex" onSubmit={handleSubmit}>
      <InputGroup width={"full"}>
        <InputLeftElement pointerEvents="none">
          <input
            type="submit"
            placeholder=""
            className="w-0 overflow-hidden"
          ></input>
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          variant="filled"
          id="search"
          name="search"
          borderRadius={"full"}
          placeholder="Search"
          paddingLeft={"9"}
          width={"full"}
          type="search"
          tabIndex={1}
          border={"2px"}
          borderColor={"gray.400"}
          focusBorderColor="pink.400"
        ></Input>
      </InputGroup>
    </form>
  );
}

export default Search;
