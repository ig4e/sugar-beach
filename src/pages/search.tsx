import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Divider,
  HStack,
  IconButton,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { LoadingOverlay, Select, Input } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import { SEO } from "~/components/SEO";
import Layout from "~/components/layout/Layout";
import { LogoLargeDynamicPath } from "~/components/logos";
import ProductCard from "~/components/product/ProductCard";
import type { Locale } from "~/types/locale";
import { api } from "~/utils/api";

import { useSearchStore } from "~/store/search";

import useTranslation from "next-translate/useTranslation";
import { ORDER_BY_KEYS } from "~/config/searchConfig";
import SearchFilters from "~/components/search/SearchFilters";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

function SearchPage() {
  const { t } = useTranslation("search");
  const router = useRouter();
  const searchStore = useSearchStore();
  const debouncedSearchQuery = useDebounce(searchStore.searchQuery, 500);

  useEffect(() => {
    searchStore.parseUrl(window.location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window !== "undefined" && window.location.search]);

  useEffect(() => {
    void router.push(searchStore.generateUrl(), undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchQuery,
    searchStore.categoryIDs,
    searchStore.priceRange,
    searchStore.orderBy,
  ]);

  const { data, isLoading } = api.product.getAll.useQuery({
    limit: 100,
    searchQuery: debouncedSearchQuery,
    categoryIDs: searchStore.categoryIDs,
    status: "ACTIVE",
    orderBy: { key: searchStore.orderBy.key, type: searchStore.orderBy.type },
    // minPrice: searchStore.priceRange.min ?? undefined,
    // maxPrice: searchStore.priceRange.max ?? undefined,
  });

  return (
    <Layout>
      <SEO
        title={t("search")}
        openGraphType="website"
        image={LogoLargeDynamicPath}
      ></SEO>
      <div className="my-4 grid gap-4 md:my-10 md:gap-8 md:[grid-template-columns:15rem_1fr] lg:[grid-template-columns:18rem_1fr]">
        <div className="flex h-full flex-col gap-4 border-b md:border-e md:pb-6 md:pe-6">
          <div className="">
            <Input
              id="search"
              name="search"
              w={"100%"}
              placeholder={t("search")}
              type="search"
              onChange={(e) => searchStore.setSearchQuery(e.target.value)}
              value={searchStore.searchQuery}
              icon={<SearchIcon />}
            ></Input>
          </div>
          <div className="hidden w-full flex-col gap-2 md:flex">
            <h2 className="font-bold">{t("category")}</h2>
            <SearchCategories></SearchCategories>
          </div>
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="fixed inset-x-0 bottom-4 z-[99] flex justify-center md:hidden">
            <SearchFilters
              trigger={
                <Button
                  size="sm"
                  leftIcon={
                    <AdjustmentsHorizontalIcon className="h-5 w-5"></AdjustmentsHorizontalIcon>
                  }
                >
                  {t("search-filters")}
                </Button>
              }
            >
              <VStack alignItems={"start"}>
                <SearchSort></SearchSort>
                <div className="flex w-full flex-col gap-2">
                  <h2 className="font-bold">{t("category")}</h2>
                  <SearchCategories></SearchCategories>
                </div>
              </VStack>
            </SearchFilters>
          </div>
          <Stack
            direction={["column", "row"]}
            alignItems={"start"}
            justifyContent={"space-between"}
          >
            <h2 className="text-2xl">
              {t("search-results")}{" "}
              {debouncedSearchQuery?.length > 0 && (
                <span>
                  {t("for")}{" "}
                  <span className="font-bold text-pink-400">
                    &quot;{debouncedSearchQuery}&quot;
                  </span>
                </span>
              )}
              <span>({data?.meta.totalCount ?? 0})</span>
            </h2>

            <div className="hidden md:block">
              <SearchSort></SearchSort>
            </div>
          </Stack>

          <Divider></Divider>

          {isLoading && (
            <div className="relative min-h-[400px]">
              <LoadingOverlay
                visible={isLoading}
                overlayBlur={2}
              ></LoadingOverlay>
            </div>
          )}

          <div className=" grid h-full w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!isLoading &&
              data?.items.map((product) => {
                return (
                  <ProductCard key={product.id} product={product}></ProductCard>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SearchSort() {
  const { t } = useTranslation("search");
  const storeSetOrderBy = useSearchStore((state) => state.setOrderBy);
  const storeOrderBy = useSearchStore((state) => state.orderBy);

  return (
    <HStack
      alignItems={"end"}
      justifyContent={{ base: "space-between", md: "initial" }}
      w={{ base: "full", md: "fit-content" }}
      suppressHydrationWarning
    >
      {typeof window !== "undefined" && (
        <Select
          label={t("sort-by")}
          data={ORDER_BY_KEYS}
          w={"100%"}
          value={storeOrderBy.key}
          onChange={(val) =>
            storeSetOrderBy({
              key: val as "id" | "price" | "createdAt" | "updatedAt",
            })
          }
        ></Select>
      )}
      <IconButton
        aria-label="sort"
        size="sm"
        borderRadius={"full"}
        colorScheme="gray"
        onClick={() =>
          storeSetOrderBy({
            type: storeOrderBy.type === "desc" ? "asc" : "desc",
          })
        }
        icon={
          storeOrderBy.type === "desc" ? (
            <ArrowDownIcon className="h-6 w-6"></ArrowDownIcon>
          ) : (
            <ArrowUpIcon className="h-6 w-6"></ArrowUpIcon>
          )
        }
        mb="1"
      ></IconButton>
    </HStack>
  );
}

function SearchCategories() {
  const { lang } = useTranslation();
  const locale = lang as Locale;

  const categoriesQuery = api.category.getAll.useQuery({ limit: 100 });
  const storeCategoryIDs = useSearchStore((state) => state.categoryIDs);
  const storeAddCategory = useSearchStore((state) => state.addCategory);
  const storeRemoveCategory = useSearchStore((state) => state.removeCategory);

  return (
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
                  isChecked={storeCategoryIDs.includes(category.id)}
                  onChange={(e) =>
                    e.target.checked
                      ? storeAddCategory(category.id)
                      : storeRemoveCategory(category.id)
                  }
                  value={category.id}
                ></Checkbox>
                <span className="text-sm font-semibold">
                  {category.name[locale]}
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
  );
}

export default SearchPage;
