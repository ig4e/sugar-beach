import { SearchIcon } from "@chakra-ui/icons";
import {
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import Layout from "~/components/layout/Layout";
import ProductCard from "~/components/Product/ProductCard";
import { api } from "~/utils/api";

const projectMock = {};

function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const categoriesQuery = api.category.getAll.useQuery({ limit: 100 });
  const productsQuery = api.product.getAll.useQuery({
    limit: 100,
    searchQuery: debouncedSearchQuery,
    categoryIDs: selectedCategories,
    status: "ACTIVE",
  });

  useEffect(() => {
    setSearchQuery(router.query.query as string);
  }, [router.query.query]);

  useEffect(() => {
    const urlCategories = router.query.categories as string;
    if (urlCategories) {
      const categories = urlCategories.split(",");
      if (categories.length > 0) setSelectedCategories(categories);
    }
  }, [router.query.categories]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      void router.push(
        `/search?query=${encodeURIComponent(
          debouncedSearchQuery || ""
        )}&categories=${selectedCategories.join(",")}`
      );
    } else {
      void router.push(
        `/search?query=${
          (router.query.query as string) || ""
        }&categories=${selectedCategories.join(",")}`
      );
    }
  }, [debouncedSearchQuery, selectedCategories]);

  return (
    <Layout>
      <div className="my-4 grid gap-8 md:my-10 md:[grid-template-columns:15rem_1fr] lg:[grid-template-columns:18rem_1fr]">
        <div className="flex h-full flex-col gap-4 border-b pb-6 md:border-e md:pe-6">
          <div className="">
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
                value={searchQuery}
              ></Input>
            </InputGroup>
          </div>
          <div className="flex flex-col gap-4 ">
            <h2 className="font-bold">Category</h2>
            <VStack alignItems={"unset"} position={"relative"}>
              {categoriesQuery.isLoading ? (
                <LoadingOverlay visible overlayBlur={3}></LoadingOverlay>
              ) : (
                categoriesQuery.data?.items.map((category) => {
                  return (
                    <div
                      className="flex items-center justify-between"
                      key={category.id}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          isChecked={selectedCategories.includes(category.id)}
                          onChange={(e) =>
                            setSelectedCategories((state) => {
                              if (e.target.checked) {
                                return [...state, category.id];
                              } else {
                                return state.filter((id) => id !== category.id);
                              }
                            })
                          }
                          value={category.id}
                        ></Checkbox>
                        <span className="text-sm font-semibold">
                          {category.name.en}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">
                        ({category._count.products})
                      </span>
                    </div>
                  );
                })
              )}
            </VStack>
            <h2 className="font-bold">Shop By Price</h2>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">
            Search Results{" "}
            {debouncedSearchQuery?.length > 0 && (
              <span>
                for{" "}
                <span className="font-bold text-pink-400">
                  &quot;{debouncedSearchQuery}&quot;
                </span>
              </span>
            )}
          </h2>

          <div className="relative grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!productsQuery.isLoading ? (
              productsQuery.data?.items.map((product) => {
                return (
                  <ProductCard key={product.id} product={product}></ProductCard>
                );
              })
            ) : (
              <LoadingOverlay visible={true} overlayBlur={2}></LoadingOverlay>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SearchPage;
