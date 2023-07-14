import {
  Avatar,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoadingOverlay, Select } from "@mantine/core";
import { useEffect, type ReactElement } from "react";
import { type RouterInputs, api } from "~/utils/api";
import { LogoLargeDynamicPath } from "../logos";

function ManageStaff(props: {
  userId: string;
  trigger: ReactElement;
  onRefetch: () => void;
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = api.user.get.useQuery({
    id: props.userId,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading user",
        description: error.message,
      });
    }
  }, [isError, error, toast]);

  const editUserRoleMutation = api.user.editRole.useMutation({
    onSuccess() {
      toast({
        title: "User role updated",
        status: "success",
      });
      props.onRefetch();
      onClose();
    },
    onError(error) {
      toast({
        title: "Error updating user role",
        description: error.message,
        status: "error",
      });
    },
  });

  const userImage = user?.media?.url ?? user?.image ?? LogoLargeDynamicPath;

  return (
    <>
      <div onClick={onOpen}>{props.trigger}</div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody position={"relative"} minH={"16"}>
            <LoadingOverlay visible={isLoading}></LoadingOverlay>
            {user && (
              <>
                <FormControl>
                  <Stack
                    alignItems={"start"}
                    width={"full"}
                    direction={["column"]}
                    spacing={4}
                  >
                    <HStack>
                      <Avatar
                        src={userImage}
                        name={user.name}
                        size="md"
                      ></Avatar>
                      <VStack alignItems={"start"} spacing={0}>
                        <Text whiteSpace={"nowrap"} fontWeight={"bold"}>
                          {user.name}
                        </Text>
                        <Text whiteSpace={"nowrap"}>{user.email}</Text>
                      </VStack>
                    </HStack>

                    <Divider></Divider>

                    <div>
                      <FormLabel>Role</FormLabel>
                      <Select
                        defaultValue={user.role}
                        data={[
                          { value: "ADMIN", label: "Admin" },
                          { value: "STAFF", label: "Staff" },
                          { value: "USER", label: "User" },
                        ]}
                        searchable={true}
                        onChange={(role) =>
                          role &&
                          editUserRoleMutation.mutate({
                            id: user.id,
                            role: role as RouterInputs["user"]["editRole"]["role"],
                          })
                        }
                      ></Select>
                    </div>
                  </Stack>
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onClose}
              variant={"outline"}
            >
              Close
            </Button>
            <Button onClick={onClose}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageStaff;
