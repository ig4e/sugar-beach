import { SearchIcon } from "@chakra-ui/icons";
import {
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  VStack
} from "@chakra-ui/react";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import { SEO } from "~/components/SEO";
import Layout from "~/components/layout/Layout";
import { LogoLargeDynamicPath } from "~/components/logos";
import ProductCard from "~/components/product/ProductCard";
import type { Locale } from "~/types/locale";
import { api } from "~/utils/api";

import useCurrency from "~/hooks/useCurrency";
import { useSearchStore } from "~/store/search";

import useTranslation from "next-translate/useTranslation";

function SearchPage() {
  const { t, lang } = useTranslation("search");
  const locale = lang as Locale;
  const router = useRouter();
  const searchStore = useSearchStore();
  const debouncedSearchQuery = useDebounce(searchStore.searchQuery, 500);
  const categoriesQuery = api.category.getAll.useQuery({ limit: 100 });

  const currency = useCurrency();

  useEffect(() => {
    searchStore.parseUrl(router.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  useEffect(() => {
    void router.push(searchStore.generateUrl(), undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchStore.categoryIDs,
    searchStore.searchQuery,
    searchStore.priceRange,
  ]);

  const { data, isError, isLoading, refetch } = api.product.getAll.useQuery({
    limit: 100,
    searchQuery: debouncedSearchQuery,
    categoryIDs: searchStore.categoryIDs,
    status: "ACTIVE",
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
                placeholder={t("search")}
                paddingStart={"9"}
                width={"full"}
                type="search"
                tabIndex={1}
                border={"2px"}
                borderColor={"gray.400"}
                focusBorderColor="pink.400"
                onChange={(e) => searchStore.setSearchQuery(e.target.value)}
                value={searchStore.searchQuery}
              ></Input>
            </InputGroup>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">{t("category")}</h2>
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
                          isChecked={searchStore.categoryIDs.includes(
                            category.id
                          )}
                          onChange={(e) =>
                            e.target.checked
                              ? searchStore.addCategory(category.id)
                              : searchStore.removeCategory(category.id)
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
            {/* <h2 className="font-bold">{t("shop-by-price")}</h2>
            {data && (
              <VStack>
                <RangeSlider
                  // eslint-disable-next-line jsx-a11y/aria-proptypes
                  aria-label={["min", "max"]}
                  value={[
                    searchStore.priceRange.min,
                    searchStore.priceRange.max,
                  ]}
                  onChange={(val) =>
                    searchStore.setPriceRange({
                      min: val[0] ?? data.meta.priceRange.min ?? 0,
                      max: val[1] ?? data.meta.priceRange.max ?? 0,
                    })
                  }
                  max={data.meta.priceRange.max || undefined}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>

                <HStack>
                  <NumberInput
                    value={searchStore.priceRange.min}
                    onChange={(value) =>
                      searchStore.setPriceRange({
                        min: Number(value) ?? undefined,
                      })
                    }
                    formatter={(value) => currency(Number(value)).format()}
                  ></NumberInput>
                  <Text>To</Text>
                  <NumberInput
                    value={searchStore.priceRange.max}
                    onChange={(value) =>
                      searchStore.setPriceRange({
                        max: Number(value) ?? undefined,
                      })
                    }
                    formatter={(value) => currency(Number(value)).format()}
                  ></NumberInput>
                </HStack>
              </VStack>
            )} */}
          </div>
        </div>
        <div className="relative flex flex-col gap-4">
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
          </h2>

          <LoadingOverlay visible={isLoading} overlayBlur={2}></LoadingOverlay>

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

export default SearchPage;
