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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/solid";
import { api } from "~/utils/api";

export interface File {
  id: string;
  url: string;
  isVideo: boolean;
}

function UploadProductMedia({
  onChange,
}: {
  onChange?: (fileURLs: string[]) => void;
}) {
  const toast = useToast();
  const mediaDeleteManyHook = api.media.deleteMany.useMutation();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadingFilesCount, setUploadingFilesCount] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    onChange && onChange(uploadedFiles.map((file) => file.url));
  }, [uploadedFiles]);

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing({
    endpoint: "productMedia",
    onClientUploadComplete: (res) => {
      console.log(res);

      setIsUploaded(true);

      setUploadingFilesCount((state) => state - 1);

      toast({
        status: "success",
        title: "Upload complete",
        description: "uploaded successfully!",
        duration: 4000,
      });
    },
    onUploadError: (e) => {
      setUploadingFilesCount((state) => state - 1);
      toast({
        status: "error",
        title: "Upload failed",
        description: "failed to upload:\n" + e.message,
        duration: 4000,
      });
    },
  });

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]!;
    const isVideo = file.type.includes("video");
    setUploadingFilesCount((state) => state + 1);
    const result = await startUpload([file]);

    if (result) {
      const uploadedFile = result[0]!;
      setUploadedFiles((state) => [
        ...state,
        { id: uploadedFile.fileKey, url: uploadedFile.fileUrl, isVideo },
      ]);
    }
  }, []);

  const fileTypes = ["image", "video"];

  function deleteFile(fileKey: string) {
    mediaDeleteManyHook.mutate(
      {
        fileKeys: [fileKey],
      },
      {
        onSuccess: () => {
          toast({ status: "success", title: "Deleted media" });
          setUploadedFiles((state) =>
            state.filter((file) => file.id !== fileKey)
          );
        },
      }
    );
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div className="space-y-4 rounded-md border border-dashed border-zinc-300 p-4">
      <div className="grid grid-flow-row gap-2 [grid-template-columns:_repeat(4,_minmax(0,_1fr));]">
        {uploadedFiles.length > 0 &&
          uploadedFiles.map((file, fileIndex) => {
            return (
              <div
                key={file.id}
                className={clsx("group relative aspect-square  rounded-md", {
                  "col-span-2 row-span-2 border-2 border-dashed border-pink-500 p-4":
                    fileIndex === 0,
                  "border border-dashed border-pink-600 p-0.5": fileIndex !== 0,
                })}
              >
                <IconButton
                  onClick={() => deleteFile(file.id)}
                  className="pointer-events-none right-2 top-2 z-50 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                  position={"absolute"}
                  icon={<TrashIcon className="h-5 w-5"></TrashIcon>}
                  aria-label="delete image"
                  colorScheme="red"
                ></IconButton>

                {fileIndex === 0 && (
                  <Badge position={"absolute"} className="left-4 top-4 z-50">
                    Main Image
                  </Badge>
                )}

                {file.isVideo && (
                  <video
                    className="h-full w-full rounded-md object-cover"
                    src={file.url}
                    controls
                  />
                )}
                {!file.isVideo && (
                  <img
                    className="h-full w-full rounded-md object-cover"
                    src={file.url}
                  />
                )}
              </div>
            );
          })}

        {uploadingFilesCount > 0 && (
          <div className="flex aspect-square h-full w-full flex-col items-center justify-center gap-4 rounded-md border border-dashed border-zinc-300 p-2">
            <Badge>Uploading</Badge>
            <Spinner colorScheme="pink" size={"xl"}></Spinner>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div
            {...getRootProps()}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-zinc-300 p-2"
          >
            <input {...getInputProps()} />
            <Badge>{isDragActive ? "Drop Here" : "Add files"}</Badge>
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className="flex min-h-[10rem] flex-col items-center justify-center gap-2 "
      >
        <input {...getInputProps()} />

        <Badge>{isDragActive ? "Drop Here" : "Add files"}</Badge>

        <span className="text-sm text-zinc-500">
          Accepts images, or videos.
        </span>
      </div>
    </div>
  );
}

export default UploadProductMedia;
