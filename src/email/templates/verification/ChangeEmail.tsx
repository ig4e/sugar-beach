import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

function ChangeEmail({ code }: { code: string }) {
  return (
    <Html>
      <Head>
        <title>Your email verification code is S8F8PH</title>
      </Head>
      <Preview>
        Before we change the email on your account, we just need to confirm that
        this is you. Below is the verification code for your account.
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
              Before we change the email on your account, we just need to
              confirm that this is you. Below is the verification code for your
              account.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Text className="text-[24px] font-semibold leading-[24px] text-black">
                {code}
              </Text>
            </Section>

            <Section>
              <Text className="text-[14px] leading-[24px] text-black">
                Don&apos;t share this code with anyone. If you didn&apos;t ask
                for this code, please ignore this email.
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

export default ChangeEmail;
