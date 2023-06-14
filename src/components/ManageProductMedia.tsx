import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import {
  Badge,
  Button,
  HStack,
  IconButton,
  Skeleton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/solid";
import { api } from "~/utils/api";
import { Media } from "@prisma/client";
import Image from "next/image";
import * as _ from "lodash";

function ManageProductMedia({
  value,
  onChange,
}: {
  value?: Media[];
  onChange?: (fileURLs: Media[]) => void;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<Media[]>([]);
  const [uploadingFilesCount, setUploadingFilesCount] = useState(0);

  const toast = useToast({ duration: 3000 });
  const deleteMedia = api.media.deleteMany.useMutation();

  useEffect(() => {
    if (value) {
      setUploadedFiles(value);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      if (!_.isEqual(uploadedFiles, value)) {
        onChange(uploadedFiles);
      }
    }
  }, [uploadedFiles, onChange]);

  function onMediaDelete(key: string) {
    const media = uploadedFiles.find((media) => media.key === key);
    if (media) {
      setUploadedFiles((state) => state.filter((media) => media.key !== key));
      deleteMedia.mutate(
        { fileKeys: [key] },
        {
          onError(error, variables, context) {
            toast({
              title: "Error occurred while deleting media",
              status: "error",
              description: error.message,
            });
            setUploadedFiles((state) => [...state, media]);
          },
          onSuccess(data, variables, context) {
            toast({
              title: "Media deleted successfully",
              status: "success",
            });
          },
        }
      );
    }
  }

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    setUploadingFilesCount((state) => state + acceptedFiles.length);
    const acceptedFilesWithType = acceptedFiles.map((file) => ({
      file,
      isVideo: file.type.includes("video"),
    }));

    try {
      const result = await startUpload(acceptedFiles);

      if (result) {
        setUploadingFilesCount((state) => state - result.length);
        setUploadedFiles((state) => [
          ...state,
          ...result.map((file, index) => {
            return {
              key: file.fileKey,
              isVideo: acceptedFilesWithType[index]?.isVideo || false,
              url: file.fileUrl,
            };
          }),
        ]);

        toast({ title: "Media uploaded successfully", status: "success" });
      } else {
        setUploadingFilesCount((state) => state - acceptedFiles.length);
        toast({
          title: "Error occurred while uploading media",
          status: "error",
          description: "",
        });
      }
    } catch (e) {
      setUploadingFilesCount((state) => state - acceptedFiles.length);
      toast({
        title: "Error occurred while uploading media",
        status: "error",
        description: (e as Error).message,
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image", "video"]),
  });

  const { startUpload } = useUploadThing({
    endpoint: "productMedia",
    onClientUploadComplete: (res = []) => {
      console.log("uploaded successfully!");
    },
    onUploadError: () => {
      console.log("error occurred while uploading");
    },
  });

  if (uploadedFiles.length > 0 || uploadingFilesCount > 0)
    return (
      <div className="grid grid-flow-row gap-2 rounded-md border-2 border-dashed p-4 [grid-template-columns:_repeat(4,_minmax(0,_1fr));]">
        {uploadedFiles.map((media, index) => (
          <MediaItem
            key={media.key}
            media={media}
            onDelete={() => onMediaDelete(media.key)}
            big={index === 0}
          />
        ))}

        {Array.from({ length: uploadingFilesCount })
          .fill("d")
          .map((_, index) => (
            <div
              key={"placeholder-" + index}
              className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-2 text-center"
            >
              <Badge position={"absolute"} top={2} left={2} zIndex={30}>
                Uploading
              </Badge>
              <Skeleton className="h-full w-full"></Skeleton>
            </div>
          ))}

        <div
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-2 text-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Badge>ADD</Badge>
          <span className="text-xs">Images, or videos</span>
        </div>
      </div>
    );

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Badge>ADD MEDIA</Badge>
      <span className="text-sm">Accepts images, or videos</span>
    </div>
  );
}

function MediaItem({
  big,
  media,
  onDelete,
}: {
  big: boolean;
  media: Media;
  onDelete: () => void;
}) {
  return (
    <div
      className={clsx("group relative aspect-square rounded-md border p-0.5", {
        "col-span-2 row-span-2": big,
      })}
    >
      <IconButton
        onClick={onDelete}
        className="pointer-events-none right-2 top-2 z-50 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
        position={"absolute"}
        icon={<TrashIcon className="h-5 w-5"></TrashIcon>}
        aria-label="delete image"
        colorScheme="red"
      ></IconButton>
      {media.isVideo && (
        <video
          controls
          className="h-full w-full rounded-md object-cover"
          src={media.url}
        ></video>
      )}
      {!media.isVideo && (
        <Image
          src={media.url}
          width={256}
          height={256}
          alt={media.key}
          className="h-full w-full rounded-md object-cover"
        />
      )}
    </div>
  );
}

export default ManageProductMedia;
