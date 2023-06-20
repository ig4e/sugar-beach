import { SearchIcon } from "@chakra-ui/icons";
import {
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Search from "~/components/Navbar/Search";
import MainLayout from "~/components/layout/MainLayout";
import { useDebounce } from "usehooks-ts";
import { api } from "~/utils/api";
import ProductCard from "~/components/product/ProductCard";

function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const productsQuery = api.product.getAll.useQuery({
    limit: 100,
    searchQuery: debouncedSearchQuery,
  });

  useEffect(() => {
    setSearchQuery(router.query.query as string);
  }, [router.query.query]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      router.push(`/search?query=${encodeURIComponent(debouncedSearchQuery)}`);
    }
  }, [debouncedSearchQuery]);

  return (
    <MainLayout>
      <div className="mt-10 grid gap-8 [grid-template-columns:18rem_1fr]">
        <div className="h-full border-e pe-4">
          <InputGroup width={"full"}>
            <InputLeftElement pointerEvents="none">
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
              onChange={(e) => setSearchQuery(e.target.value)}
            ></Input>
          </InputGroup>
        </div>
        <div className="mt-1 flex flex-col gap-4">
          <h2 className="text-2xl">
            Search Results for{" "}
            <span className="font-bold text-pink-400">
              "{debouncedSearchQuery}"
            </span>
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {productsQuery.data?.items.map((product) => {
              return (
                <ProductCard key={product.id} product={product}></ProductCard>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SearchPage;
