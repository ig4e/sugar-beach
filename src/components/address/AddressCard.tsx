import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { UserShippingAddress } from "@prisma/client";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { COUNTRIES_NAME } from "~/config/commonConfig";

function AddressCard({
  address,
  active,
}: {
  address: UserShippingAddress;
  active?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <Card
      key={address.id}
      border={"1px"}
      borderColor={active ? "pink.400" : "gray.400"}
      width={"full"}
      bg={active ? undefined : "gray.200"}
    >
      <CardHeader>
        <VStack flexWrap={"wrap"} alignContent={"start"} alignItems={"start"}>
          <Heading size={"xs"}>{address.fullName}</Heading>
          <HStack>
            <Badge colorScheme="blue">{t(address.type)}</Badge>
          </HStack>
        </VStack>
      </CardHeader>
      <Divider></Divider>
      <CardBody>
        <VStack alignContent={"start"} alignItems={"start"} spacing={1}>
          <Text fontSize="sm">{address.streetName}</Text>

          <Text fontSize="sm">{address.city}</Text>
          <Text fontSize="sm">{address.province}</Text>
          <Text fontSize="sm">{COUNTRIES_NAME[address.country]}</Text>

          <Text fontSize="sm">
            {t("phone-number")}
            {address.phoneNumber.code} {address.phoneNumber.number}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}

export default AddressCard;
