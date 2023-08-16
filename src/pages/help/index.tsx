import { Card, CardBody, Heading, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import "react-cmdk/dist/cmdk.css";
import HelpLayout from "~/components/layout/HelpLayout";
import { type Locale } from "~/types/locale";

import { HelpSearch } from "~/components/navbar/HelpNavbar";
import { HELP_CENTER_PAGES } from "~/config/helpCenterConfig";

function HelpPage() {
  const { t, lang } = useTranslation("help");
  const locale = lang as Locale;

  return (
    <HelpLayout container={false}>
      <div className="mb-16 space-y-16">
        <section className="flex h-80 min-h-fit flex-col items-center justify-center bg-gradient-to-tr  from-pink-500 via-orange-500 to-sky-500 text-center text-white">
          <div className="container mx-auto flex flex-col items-center justify-center gap-8">
            <Heading size={"2xl"}>{t("welcome")}</Heading>

            <div className="w-full max-w-sm">
              <HelpSearch></HelpSearch>
            </div>
          </div>
        </section>

        <section className="container mx-auto">
          <div className="space-y-4 text-center">
            <Heading size={"xl"} className="[text-wrap:balance]">
              {t("need-help-section.header")}
            </Heading>
            <p className="text-lg font-medium [text-wrap:balance]">
              {t("need-help-section.text")}
            </p>
          </div>
        </section>

        <section className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {HELP_CENTER_PAGES.map((page) => {
            return (
              <Link key={page.title.en} href={`/help/${page.path}`}>
                <Card
                  overflow={"hidden"}
                  border={"1px"}
                  borderColor={"gray.400"}
                >
                  <CardBody className="group transition hover:bg-gray-100">
                    <Heading size={"md"} className="group-hover:underline">
                      {page.title[locale]}
                    </Heading>
                    <Text className="[text-wrap:balance]">
                      {page.description[locale]}
                    </Text>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </HelpLayout>
  );
}

export default HelpPage;
