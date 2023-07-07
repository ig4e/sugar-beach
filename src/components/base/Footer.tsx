import { Divider, Heading, Stack } from "@chakra-ui/react";
import AmericanExpressLogo from "public/images/logos/payments/AmericanExpress.png";
import ApplePayLogo from "public/images/logos/payments/ApplePay.png";
import MadaLogo from "public/images/logos/payments/Mada.png";
import MasterCardLogo from "public/images/logos/payments/MasterCard.png";
import MoyasserLogo from "public/images/logos/payments/Moyasser.png";
import StcPayLogo from "public/images/logos/payments/StcPay.png";
import VisaLogo from "public/images/logos/payments/Visa.png";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LogoSmallTransparent } from "../logos";

export const paymentOptionLogos = [
  VisaLogo,
  MadaLogo,
  ApplePayLogo,
  MasterCardLogo,
  StcPayLogo,
  AmericanExpressLogo,
  MoyasserLogo,
];

function Footer() {
  const t = useTranslations("Footer");

  return (
    <div className="bg-white">
      <div className="container mx-auto space-y-4 py-4">
        <div className="flex items-center justify-between">
          <Stack
            spacing={"4"}
            direction={["column", "row"]}
            alignItems={"center"}
          >
            <Heading size={"sm"} className="hidden whitespace-nowrap md:block">
              {t("pay-with-ease")}
            </Heading>
            <div className="flex flex-wrap items-center gap-2">
              {paymentOptionLogos.map((logo, index) => (
                <Image
                  width={128}
                  height={64}
                  quality={100}
                  src={logo}
                  alt="Payment method"
                  key={`payment-logo-${index}`}
                  className="h-8 w-16 object-cover"
                />
              ))}
            </div>
          </Stack>
        </div>

        <Divider></Divider>

        <div className="flex items-start gap-x-8 gap-y-2 md:gap-x-16 lg:gap-x-24">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">{t("about-us")}</span>
            <span className="text-sm">{t("about-us")}</span>
            <span className="text-sm">{t("contact-us")}</span>
            <span className="text-sm">{t("support")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className=" font-semibold">{t("legal")}</span>
            <span className="text-sm">{t("terms-of-use")}</span>
            <span className="text-sm">{t("terms-of-sale")}</span>
            <span className="text-sm">{t("privacy-policy")}</span>
          </div>
        </div>

        <Divider></Divider>

        <Stack
          spacing={"4"}
          direction={["column", "row"]}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <Heading size={"xs"} className="whitespace-nowrap">
            {t("stay-updated-with-us")}
          </Heading>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23.877"
              viewBox="0 0 24 23.877"
            >
              <path
                id="icons8-facebook"
                d="M15,3a11.993,11.993,0,0,0-1.794,23.852V18.18H10.237V15.026h2.969v-2.1c0-3.475,1.693-5,4.581-5a16.845,16.845,0,0,1,2.461.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18H16.624v8.7A11.993,11.993,0,0,0,15,3Z"
                transform="translate(-3 -3)"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21.075"
              height="24"
              viewBox="0 0 21.075 24"
            >
              <g id="icons8-tiktok" transform="translate(-6 -4.07)">
                <path
                  id="Path_4"
                  data-name="Path 4"
                  d="M18.255,23.863a3.006,3.006,0,0,0,3.005-3.005V5.272h3.13c-.019-.084-.043-.166-.058-.252h0c-.026-.149-.046-.3-.06-.448v-.5H20.058V19.655a3.006,3.006,0,0,1-3.005,3.005,2.975,2.975,0,0,1-1.427-.376A2.994,2.994,0,0,0,18.255,23.863Z"
                  transform="translate(-3.84)"
                />
                <path
                  id="Path_5"
                  data-name="Path 5"
                  d="M32.318,9.278a5.417,5.417,0,0,1-.966-2.258h0c-.026-.149-.046-.3-.06-.448v-.5H30.208A5.45,5.45,0,0,0,32.318,9.278Z"
                  transform="translate(-9.658 -0.798)"
                />
                <path
                  id="Path_6"
                  data-name="Path 6"
                  d="M16.005,23.005a3,3,0,0,0-1.427,5.635,2.975,2.975,0,0,1-.376-1.427,3.005,3.005,0,0,1,3.606-2.945V20.031c-.2-.017-.4-.031-.6-.031s-.4.014-.6.03v3.035A3.042,3.042,0,0,0,16.005,23.005Z"
                  transform="translate(-2.793 -6.355)"
                />
                <path
                  id="Path_7"
                  data-name="Path 7"
                  d="M35.244,12.835a5.435,5.435,0,0,0,1.687.68v-.226h0v-.83a5.436,5.436,0,0,1-2.889-.825c-.112-.07-.217-.148-.323-.226A5.469,5.469,0,0,0,35.244,12.835Z"
                  transform="translate(-11.058 -2.927)"
                />
                <path
                  id="Path_8"
                  data-name="Path 8"
                  d="M13.814,19.232v-1.2c-.2-.016-.4-.03-.6-.03A7.207,7.207,0,0,0,8.753,30.874a7.2,7.2,0,0,1,5.06-11.642Z"
                  transform="translate(0 -5.557)"
                />
                <path
                  id="Path_9"
                  data-name="Path 9"
                  d="M27.7,14.914v2.845a9.326,9.326,0,0,1-5.441-1.739l0,7.962-.008-.011s0,.007,0,.011a7.205,7.205,0,0,1-11.672,5.661,7.207,7.207,0,0,0,12.874-4.459s0-.007,0-.011l.008.011V17.221A9.326,9.326,0,0,0,28.9,18.96V15.89h0v-.83A5.418,5.418,0,0,1,27.7,14.914Z"
                  transform="translate(-1.828 -4.326)"
                />
                <path
                  id="Path_10"
                  data-name="Path 10"
                  d="M21.223,20.453s0-.007,0-.011l.008.011V12.49a9.326,9.326,0,0,0,5.441,1.739V11.385a5.322,5.322,0,0,1-3.212-2.108,5.448,5.448,0,0,1-2.11-3.208H18.218V21.655a3,3,0,0,1-5.635,1.427,3,3,0,0,1,2.029-5.574V14.473a7.2,7.2,0,0,0-5.06,11.641,7.205,7.205,0,0,0,11.672-5.661Z"
                  transform="translate(-0.798 -0.798)"
                />
              </g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23.818"
              height="19.678"
              viewBox="0 0 23.818 19.678"
            >
              <path
                id="icons8-twitter"
                d="M15.573,5.469a4.941,4.941,0,0,0-4.936,4.936,4.845,4.845,0,0,0,.057.484A12.239,12.239,0,0,1,2.329,6.465a.458.458,0,0,0-.393-.172.453.453,0,0,0-.361.229A4.834,4.834,0,0,0,1.9,11.913c-.117-.052-.245-.08-.356-.142a.455.455,0,0,0-.669.4v.057a4.911,4.911,0,0,0,2.148,4.026.351.351,0,0,1-.043,0,.454.454,0,0,0-.512.583,4.946,4.946,0,0,0,3.414,3.229,8.506,8.506,0,0,1-4.367,1.209,8.547,8.547,0,0,1-1.01-.057.455.455,0,0,0-.3.839,13.128,13.128,0,0,0,7.113,2.091,12.785,12.785,0,0,0,9.816-4.31,13.7,13.7,0,0,0,3.4-8.905c0-.13-.011-.256-.014-.384a9.535,9.535,0,0,0,2.162-2.262.455.455,0,0,0-.569-.669c-.235.1-.509.116-.754.2a4.832,4.832,0,0,0,.768-1.423.455.455,0,0,0-.669-.526,8.531,8.531,0,0,1-2.546.982A4.9,4.9,0,0,0,15.573,5.469Zm0,.91a4.03,4.03,0,0,1,2.945,1.28.458.458,0,0,0,.427.128,9.368,9.368,0,0,0,1.707-.512,4.053,4.053,0,0,1-1.167,1.067.455.455,0,0,0,.3.854,9.406,9.406,0,0,0,1.295-.356A8.647,8.647,0,0,1,19.8,9.978a.454.454,0,0,0-.185.4c.007.185.014.368.014.555a12.807,12.807,0,0,1-3.172,8.294,11.827,11.827,0,0,1-9.133,4.012,12.174,12.174,0,0,1-5.079-1.11,9.423,9.423,0,0,0,5.121-1.949.455.455,0,0,0-.27-.811,3.987,3.987,0,0,1-3.428-2.134h.071a4.966,4.966,0,0,0,1.309-.171.455.455,0,0,0-.028-.882A4,4,0,0,1,1.9,12.895a4.833,4.833,0,0,0,1.437.3.455.455,0,0,0,.27-.839A4.031,4.031,0,0,1,1.816,9a3.955,3.955,0,0,1,.313-1.451,13.14,13.14,0,0,0,9.062,4.339.461.461,0,0,0,.373-.16.455.455,0,0,0,.1-.395,4.065,4.065,0,0,1-.114-.925A4.018,4.018,0,0,1,15.573,6.379Z"
                transform="translate(0.527 -4.969)"
                stroke="#000"
                stroke-width="1"
              />
            </svg>
          </div>
        </Stack>

        <Divider></Divider>

        <div className="flex items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-4">
            <Image
              src={LogoSmallTransparent}
              width={62}
              height={62}
              alt="Logo"
              className="hidden md:block"
            ></Image>
            <span>© 2023 Sugar Beach</span>
          </div>
          <span>By Ahmed Mohamed</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
