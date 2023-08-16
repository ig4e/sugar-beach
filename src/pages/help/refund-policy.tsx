import useTranslation from "next-translate/useTranslation";
import React from "react";
import HelpLayout from "~/components/layout/HelpLayout";
import Trans from "next-translate/Trans";

const policiesList = [
  "eligibility",
  "product-validity",
  "condition-of-return",
  "refund-process",
  "order-cancellation",
  "return-shipping-fees",
  "refund-processing-time",
  "unreceived-shipments",
];

function RefundPolicy() {
  const { t } = useTranslation("refundPolicy");

  return (
    <HelpLayout>
      <div className="prose my-8 max-w-full md:prose-lg">
        <h3>{t("header")}</h3>

        <p>{t("text")}</p>

        <ol>
          {policiesList.map((policy) => (
            <li key={policy}>
              <Trans
                i18nKey={`refundPolicy:policies-list.${policy}`}
                components={[<strong key={policy} />]}
              />
            </li>
          ))}
        </ol>

        <p>{t("ending-text")}</p>
      </div>
    </HelpLayout>
  );
}

export default RefundPolicy;
