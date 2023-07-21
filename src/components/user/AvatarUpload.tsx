/* eslint-disable @next/next/no-img-element */
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { api } from "~/utils/api";

import useTranslation from "next-translate/useTranslation";

import "react-image-crop/dist/ReactCrop.css";

import { useRef, useState } from "react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";

import { FileButton } from "@mantine/core";
import { useUploadThing } from "~/utils/uploadthing";
import { useSession } from "next-auth/react";

export function AvatarUpload(props: { onRefetch: () => void }) {
  const { t } = useTranslation("account");
  const session = useSession();
  const updateUserAvatar = api.user.updateUserAvatar.useMutation();
  const toast = useToast();
  const [src, setSrc] = useState<string>();
  const { isOpen, onClose, onOpen } = useDisclosure({
    onClose() {
      setSrc("");
    },
  });

  const { isUploading, startUpload } = useUploadThing("userMedia", {
    onClientUploadComplete: (res) => {
      if (!res) return;
      const avatar = res[0];
      if (!avatar) return;

      updateUserAvatar.mutate(
        { url: avatar.fileUrl, key: avatar.fileKey },
        {
          onSuccess() {
            toast({
              title: t("AvatarUpload.user-avatar-updated-success"),
              status: "success",
            });

            props.onRefetch();
            onClose();
            setSrc("");
          },
          onError(error) {
            toast({
              title: t("AvatarUpload.user-avatar-updated-error"),
              description: error.message,
              status: "error",
            });
          },
        }
      );
    },
    onUploadError: (error: Error) => {
      toast({
        title: t("AvatarUpload.user-avatar-updated-upload-error"),
        description: error.message,
        status: "error",
      });
    },
  });

  const [crop, setCrop] = useState<Crop>();
  const [storedCrop, setStoredCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);

  async function uploadImage() {
    if (!imageRef.current || !storedCrop)
      return toast({
        title: "Error",
        description: "Please crop the image first",
        status: "error",
      });
    const canvas = cropImage(imageRef.current, storedCrop);

    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((blob) => {
        blob ? res(blob) : rej("No blob");
      });
    });

    const file = new File(
      [blob],
      session?.data?.user
        ? `${session.data.user.id}-avatar.png`
        : "cropped.png",
      { type: "image/png" }
    );

    await startUpload([file]);
  }

  return src ? (
    <div className="w-full max-w-md space-y-2">
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("AvatarUpload.edit-avatar")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{t("AvatarUpload.crop-avatar")}</FormLabel>
              <ReactCrop
                aspect={1}
                crop={crop}
                onChange={(_, percent) => setCrop(percent)}
                onComplete={(c) => setStoredCrop(c)}
              >
                <img ref={imageRef} src={src} alt="Crop me" />
              </ReactCrop>
              <FormHelperText>
                {t("AvatarUpload.crop-avatar-helper")}{" "}
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => void uploadImage()}
              isLoading={isUploading}
              loadingText="Uploading..."
            >
              {t("AvatarUpload.upload")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  ) : (
    <FileButton
      accept="image/png,image/jpeg"
      onChange={(e) => {
        if (e) {
          setSrc(URL.createObjectURL(e as unknown as Blob));
          onOpen();
        }
      }}
    >
      {(props) => (
        <Button {...props} borderRadius={"full"} colorScheme="gray">
          {t("AvatarUpload.change-avatar")}
        </Button>
      )}
    </FileButton>
  );
}

function cropImage(image: HTMLImageElement, crop: PixelCrop) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return canvas;
}

// export const AvatarUpload = ({ onRefetch }: { onRefetch: () => void }) => {
//   const {t} = useTranslation("account");
//   const updateUserAvatar = api.user.updateUserAvatar.useMutation();
//   const toast = useToast();

//   return (
//     <UploadButton<OurFileRouter>
//       endpoint="userMedia"

//       onClientUploadComplete={(res) => {
//         if (!res) return;
//         const avatar = res[0];
//         if (!avatar) return;

//         updateUserAvatar.mutate(
//           { url: avatar.fileUrl, key: avatar.fileKey },
//           {
//             onSuccess() {
//               toast({
//                 title: t("AvatarUpload.user-avatar-updated-success"),
//                 status: "success",
//               });

//               onRefetch();
//             },
//             onError(error) {
//               toast({
//                 title: t("AvatarUpload.user-avatar-updated-error"),
//                 description: error.message,
//                 status: "error",
//               });
//             },
//           }
//         );
//       }}
//       onUploadError={(error: Error) => {
//         toast({
//           title: t("AvatarUpload.user-avatar-updated-upload-error"),
//           description: error.message,
//           status: "error",
//         });
//       }}
//     />
//   );
// };
