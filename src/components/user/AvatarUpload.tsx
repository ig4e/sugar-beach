import { useToast } from "@chakra-ui/react";
import { UploadButton } from "@uploadthing/react";
import { useTranslations } from "next-intl";
import type { OurFileRouter } from "~/server/uploadthing";
import { api } from "~/utils/api";

export const AvatarUpload = ({ onRefetch }: { onRefetch: () => void }) => {
  const t = useTranslations("AvatarUpload");
  const updateUserAvatar = api.user.updateUserAvatar.useMutation();
  const toast = useToast();

  return (
    <UploadButton<OurFileRouter>
      endpoint="userMedia"
      onClientUploadComplete={(res) => {
        if (!res) return;
        const avatar = res[0];
        if (!avatar) return;

        updateUserAvatar.mutate(
          { url: avatar.fileUrl },
          {
            onSuccess() {
              toast({
                title: t("user-avatar-updated-success"),
                status: "success",
              });

              onRefetch();
            },
            onError(error) {
              toast({
                title: t("user-avatar-updated-error"),
                description: error.message,
                status: "error",
              });
            },
          }
        );
      }}
      onUploadError={(error: Error) => {
        toast({
          title: t("user-avatar-updated-upload-error"),
          description: error.message,
          status: "error",
        });
      }}
    />
  );
};
