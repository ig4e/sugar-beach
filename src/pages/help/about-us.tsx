import { Heading } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import HelpLayout from "~/components/layout/HelpLayout";

const reasonsList = [
  "reasons-list.high-quality",
  "reasons-list.diversity-and-distinction",
  "reasons-list.competitive-prices",
  "reasons-list.exceptional-experience",
];

function AboutUs() {
  const { t } = useTranslation("aboutUs");

  return (
    <HelpLayout>
      <div className="my-8 space-y-4 prose md:prose-lg lg:prose-xl max-w-full">
        <Heading size="lg">{t("about-us")}</Heading>

        <section>
          <p className="[text-wrap:balance]">{t("welcome")}</p>
        </section>

        <section className="space-y-2">
          <Heading size={"md"}>{t("why-us")}</Heading>
          <ol className="list-decimal space-y-1">
            {reasonsList.map((reason) => (
              <li key={reason}>
                <span className="font-semibold">{t(`${reason}.header`)}</span>{" "}
                {t(`${reason}.text`)}
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-2">
          <Heading size={"md"}>{t("our-mission-header")}</Heading>

          <p className="[text-wrap:balance]">{t("our-mission")}</p>
        </section>
      </div>
    </HelpLayout>
  );
}

export default AboutUs;
