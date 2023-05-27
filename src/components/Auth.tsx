import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

function Auth() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <span className="text-sm font-semibold">Sign In / Sign up</span>
      </Button>

      <Modal size={"3xl"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalBody>
              <p>Modal Body</p>
            </ModalBody>
            <ModalFooter>Modal Footer</ModalFooter>
            <ModalCloseButton></ModalCloseButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default Auth;
