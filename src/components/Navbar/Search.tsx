import { SearchIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Input from "../Base/Input";

function Search() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void router.push(
      `/search?query=${
        (e.currentTarget as unknown as { search: { value: string } }).search
          .value
      }`
    );
  }

  return (
    <form className="relative flex w-full" onSubmit={handleSubmit}>
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
