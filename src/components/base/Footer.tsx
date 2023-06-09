import { HStack, Heading } from "@chakra-ui/react";
import React from "react";
import VisaLogo from "public/images/logos/payments/Visa.png";
import MadaLogo from "public/images/logos/payments/Mada.png";
import ApplePayLogo from "public/images/logos/payments/ApplePay.png";
import MasterCardLogo from "public/images/logos/payments/MasterCard.png";
import StcPayLogo from "public/images/logos/payments/StcPay.png";
import AmericanExpressLogo from "public/images/logos/payments/AmericanExpress.png";
import MoyasserLogo from "public/images/logos/payments/Moyasser.png";
import Image from "next/image";

const paymentOptionLogos = [
  VisaLogo,
  MadaLogo,
  ApplePayLogo,
  MasterCardLogo,
  StcPayLogo,
  AmericanExpressLogo,
  MoyasserLogo,
];

function Footer() {
  return (
    <div className="bg-white">
      <div className="container mx-auto space-y-4 py-4">
        <div className="flex items-center justify-between">
          <HStack spacing={"4"}>
            <Heading size={"sm"} className="hidden whitespace-nowrap md:block">
              Pay With Ease
            </Heading>
            <div className="flex flex-wrap items-center gap-2">
              {paymentOptionLogos.map((logo, index) => (
                <Image
                  width={64}
                  height={32}
                  src={logo}
                  alt="Payment method"
                  key={"payment-logo" + index}
                  className="h-8 w-16 object-cover"
                />
              ))}
            </div>
          </HStack>

          <HStack spacing={"4"}>
            <Heading size={"xs"} className="hidden whitespace-nowrap md:block">
              Stay updated with us
            </Heading>
            <div className="flex flex-wrap items-center gap-2">
              {paymentOptionLogos.map((logo, index) => (
                <Image
                  width={64}
                  height={32}
                  src={logo}
                  alt="Payment method"
                  key={"payment-logo" + index}
                  className="h-8 w-16 object-cover"
                />
              ))}
            </div>
          </HStack>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Footer;
