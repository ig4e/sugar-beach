import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { type ReactElement, useRef, type ReactNode, cloneElement } from "react";
import Input from "../base/Input";
import useTranslation from "next-translate/useTranslation";

function SearchFilters({
  trigger,
  children,
}: {
  trigger: ReactElement;
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("search");

  return (
    <>
      {cloneElement(trigger, {
        ref: btnRef,
        onClick: onOpen,
      })}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("search-filters")}</DrawerHeader>

          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SearchFilters;
