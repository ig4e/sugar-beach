import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { SegmentedControl } from "@mantine/core";
import type { Countries } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { COUNTRIES } from "~/config/commonConfig";
import { useStore } from "~/hooks/useStore";
import { useLocalisationStore } from "~/store/localisation";

import useTranslation from "next-translate/useTranslation";
import { Locale } from "~/types/locale";

function ChangeRegion() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, lang } = useTranslation("common");
  const locale = lang as Locale;
  const router = useRouter();
  const localisation = useStore(useLocalisationStore, (state) => state);

  const [currentLocalisation, setLocalisation] = useState<{
    country: Countries;
    language: string;
  }>({
    country: localisation?.country ?? "SA",
    language: locale,
  });

  useEffect(() => {
    if (localisation)
      setLocalisation((state) => ({
        ...state,
        country: localisation?.country,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!localisation]);

  const onConfirm = useCallback(() => {
    if (localisation) {
      localisation.setCountry(currentLocalisation.country);
      void router
        .push(router.pathname, router.asPath, {
          locale: currentLocalisation.language,
          shallow: true,
        })
        .then(() => void router.reload());
    }
  }, [localisation, currentLocalisation, router]);

  if (!localisation)
    return (
      <Button
        colorScheme="gray"
        className="flex items-center gap-2"
        size={"sm"}
      >
        <Image
          src={`https://flagcdn.com/w40/sa.webp`}
          alt={"sa"}
          width={44}
          height={44}
          className="h-5 w-8 rounded object-cover"
        />
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold">{locale.toLocaleUpperCase()}</span>
          <span>/</span>
          <span className="font-semibold">SAR</span>
        </div>
        <ChevronDownIcon className="h-5 w-5 text-zinc-900" />
      </Button>
    );

  return (
    <>
      <Button
        colorScheme="gray"
        className="flex items-center gap-2"
        size={"sm"}
        onClick={onOpen}
      >
        <Image
          src={`https://flagcdn.com/w40/${localisation.country.toLocaleLowerCase()}.webp`}
          alt={localisation.country.toLocaleLowerCase()}
          width={44}
          height={44}
          className="h-5 w-8 rounded object-cover"
        />
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold">{locale.toLocaleUpperCase()}</span>
          <span>/</span>
          <span className="font-semibold">{localisation.currency}</span>
        </div>
        <ChevronDownIcon className="h-5 w-5 text-zinc-900" />
      </Button>

      <Drawer
        isOpen={isOpen}
        placement={locale === "ar" ? "left" : "right"}
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("ChangeRegion.drawer.header")}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4}>
              <FormControl>
                <VStack alignItems={"start"}>
                  <FormLabel>
                    {t("ChangeRegion.drawer.body.choose-country")}
                  </FormLabel>

                  <RadioGroup
                    value={currentLocalisation.country}
                    onChange={(value: Countries) =>
                      setLocalisation((state) => ({
                        ...state,
                        country: value,
                      }))
                    }
                  >
                    <Stack direction="column" spacing={4}>
                      {COUNTRIES.map((country) => (
                        <Radio
                          key={country.code}
                          value={country.code}
                          size={"lg"}
                        >
                          <HStack mx={2}>
                            <div className="rounded border">
                              <Image
                                src={country.flag}
                                alt=""
                                width={44}
                                height={44}
                                className="h-6 w-10 rounded object-cover"
                              ></Image>
                            </div>
                            <Text>{country.name}</Text>
                          </HStack>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </VStack>
              </FormControl>
              <FormControl>
                <FormLabel>
                  {t("ChangeRegion.drawer.body.choose-language")}
                </FormLabel>

                <SegmentedControl
                  className="!w-full"
                  data={[
                    { label: "English", value: "en" },
                    { label: "عربى", value: "ar" },
                  ]}
                  value={currentLocalisation.language}
                  onChange={(value: string) =>
                    setLocalisation((state) => ({ ...state, language: value }))
                  }
                  size={"lg"}
                />
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <HStack>
              <Button variant="outline" onClick={onClose}>
                {t("ChangeRegion.drawer.footer.cancel")}
              </Button>
              <Button onClick={onConfirm}>
                {t("ChangeRegion.drawer.footer.confirm")}
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ChangeRegion;
