import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import ManageAddress from "~/components/address/ManageAddress";
import UserDashboardLayout from "~/components/layout/UserDashboardLayout";
import { COUNTRIES_NAME } from "~/config/commonConfig";
import { api } from "~/utils/api";

/*

  fullName: z.string(),
  phoneNumber: z.string(),
  type: z.enum(["HOME", "OFFICE"]),
  country: z.enum(["BH", "KW", "OM", "QA", "SA", "AE"]),
  streetName: z.string(),
  buildingNumber: z.string(),
  city: z.string(),
  area: z.string(),
  province: z.string(),
  nearestLandmark: z.string(),
*/

function Addresses() {
  const toast = useToast();
  const userAddresses = api.user.address.findMany.useQuery({});
  const deleteUserAddress = api.user.address.delete.useMutation({
    onSuccess(data, variables, context) {
      toast({
        title: "Address Deleted",
        status: "success",
      });
      void userAddresses.refetch();
    },
    onError(error, variables, context) {
      toast({
        title: "Failed to delete address",
        status: "error",
        description: error.message,
      });
    },
  });

  return (
    <UserDashboardLayout>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <Heading size={"sm"}>My Addresses</Heading>
          </CardHeader>
          <Divider></Divider>
          <CardBody>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {userAddresses.data?.map((address, index) => {
                return (
                  <Card
                    key={address.id}
                    border={"1px"}
                    borderColor={"gray.400"}
                    width={"full"}
                  >
                    <CardHeader>
                      <VStack
                        flexWrap={"wrap"}
                        alignContent={"start"}
                        alignItems={"start"}
                      >
                        <Heading size={"xs"}>{address.fullName}</Heading>
                        <HStack>
                          <Badge>{index === 0 ? "Default" : "Secondary"}</Badge>
                          <Badge colorScheme="blue">{address.type}</Badge>
                        </HStack>
                      </VStack>
                    </CardHeader>
                    <Divider></Divider>
                    <CardBody>
                      <VStack
                        alignContent={"start"}
                        alignItems={"start"}
                        spacing={1}
                      >
                        <Text fontSize="sm">{address.streetName}</Text>

                        <Text fontSize="sm">{address.city}</Text>
                        <Text fontSize="sm">{address.province}</Text>
                        <Text fontSize="sm">
                          {COUNTRIES_NAME[address.country]}
                        </Text>

                        <Text fontSize="sm">
                          Phone number:{address.phoneNumber.code}{" "}
                          {address.phoneNumber.number}
                        </Text>
                      </VStack>
                    </CardBody>

                    <CardFooter>
                      <HStack justifyContent={"end"}>
                        <ManageAddress
                          onRefetch={() => void userAddresses.refetch()}
                          Trigger={<Button size="sm">Edit</Button>}
                          action="edit"
                          address={address}
                        ></ManageAddress>
                        <Divider orientation="vertical"></Divider>
                        <Button
                          size="sm"
                          variant={"outline"}
                          colorScheme="red"
                          onClick={() =>
                            deleteUserAddress.mutate({ id: address.id })
                          }
                          isLoading={deleteUserAddress.isLoading}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </CardFooter>
                  </Card>
                );
              })}

              <ManageAddress
                onRefetch={() => void userAddresses.refetch()}
                action="create"
                Trigger={
                  <Button
                    className="grid aspect-square !h-full max-h-full w-full border-2 border-dashed border-black"
                    colorScheme="gray"
                  >
                    <VStack>
                      <PlusIcon className="h-8 w-8"></PlusIcon>
                      <Heading size="sm">Add New Address</Heading>
                    </VStack>
                  </Button>
                }
              ></ManageAddress>
            </div>
          </CardBody>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}

export default Addresses;
