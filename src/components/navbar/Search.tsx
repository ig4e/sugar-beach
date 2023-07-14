import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Input from "../base/Input";

import useTranslation from "next-translate/useTranslation";
import { useSearchStore } from "~/store/search";

function Search() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const searchState = useSearchStore();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    searchState.setSearchQuery(
      (e.currentTarget as unknown as { search: { value: string } }).search.value
    );

    void router.push(searchState.generateUrl());
  }

  return (
    <form className="relative flex w-full" onSubmit={handleSubmit}>
      <div className="group flex w-full items-center rounded-full border-2 focus-within:border-pink-500">
        <InputGroup width={"full"}>
          <Input
            variant="filled"
            id="search"
            name="search"
            borderRadius={"full"}
            placeholder={t("Search.search")}
            width={"full"}
            type="search"
            border={"0px"}
            borderColor={"gray.400"}
            focusBorderColor="pink.400"
            borderEndRadius={"0"}
          ></Input>
        </InputGroup>
        <button
          type="submit"
          className="h-full rounded-e-full bg-[#EDF2F7] transition group-focus-within:bg-white"
          name="Submit search"
        >
          <div className="flex h-full items-center justify-center rounded-full bg-[#EDF2F7] pe-4 ps-4 group-focus-within:bg-pink-400">
            <SearchIcon
              color="gray.400"
              className="group-focus-within:text-white"
            />
          </div>
        </button>
      </div>
    </form>
  );
}

export default Search;
