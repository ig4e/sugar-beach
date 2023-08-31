import { SearchIcon } from "@chakra-ui/icons";
import { InputGroup } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import useTranslation from "next-translate/useTranslation";
import { useSearchStore } from "~/store/search";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@mantine/core";

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
      <div className="relative flex w-full items-center">
        <button
          type="submit"
          name="Submit search"
          className="absolute end-1 z-50 flex items-center justify-center rounded-full p-[0.35rem] hover:bg-gray-200"
        >
          <SearchIcon color="gray.400" />
        </button>
        <Input
          id="search"
          name="search"
          w={"100%"}
          sx={{ minWidth: "16rem"}}
          placeholder={t("Search.search")}
          type="search"
        ></Input>
      </div>
    </form>
  );
}

export default Search;
