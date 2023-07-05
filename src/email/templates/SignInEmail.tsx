import React from "react";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

function SignInEmail({ url }: { url: string }) {
  return (
    <Html>
      <Head>
        <title>Sign In</title>
      </Head>
      <Preview>
        Welcome to Sugar Beach, Click the button below to sign in to Sugar
        Beach.
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://r2.wolflandrp.xyz/transparent-logo.png`}
                width="120"
                height="60"
                alt="Sugar Beach"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 mt-[32px] p-0 text-center text-[24px] font-normal text-black">
              Welcome to Sugar Beach
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Click the button below to sign in to Sugar Beach. This button will
              expire in 24 hours.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-pink-500 text-center font-semibold text-white"
                href={url}
              >
                Sign in to Sugar Beach
              </Button>
            </Section>

            <Section>
              <Text className="text-[14px] leading-[24px] text-black">
                Or copy and paste this URL into your browser:
                <br></br>
                <Link href={url} className="text-pink-500 no-underline">
                  {url}
                </Link>
              </Text>
            </Section>

            <Hr className="mx-0 my-[16px] w-full border border-solid border-[#eaeaea]" />

            <Section className="mb-[16px]">
              <Column>
                <Img
                  src={`https://r2.wolflandrp.xyz/transparent-logo.png`}
                  width="60"
                  height="30"
                  alt="Sugar Beach"
                  className="mx-auto my-0"
                />
              </Column>

              <Column>
                <Text className="text-center text-[12px] leading-[24px] text-[#666666]">
                  © 2023 Sugar Beach, All Rights Reserved.
                </Text>
              </Column>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default SignInEmail;
