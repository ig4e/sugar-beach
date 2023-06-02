import React, { useCallback, useMemo, useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Badge, Button, HStack, IconButton } from "@chakra-ui/react";
import clsx from "clsx";
import { TrashIcon } from "@heroicons/react/24/solid";

function UploadProductMedia() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles((state) => [...state, ...acceptedFiles]);
  }, []);

  const fileTypes = ["image", "video"];

  const filesPreviewURLs = useMemo(
    () =>
      files.map((file) => {
        return {
          url: URL.createObjectURL(file),
          isVideo: file.type.includes("video"),
        };
      }),
    [files]
  );

  function deleteFile(fileIndex: number) {
    const newFiles = files.filter((f, i) => i !== fileIndex);
    setFiles(newFiles);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const { startUpload } = useUploadThing({
    endpoint: "productMedia",
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
  });

  return (
    <div className="space-y-4 rounded-md border border-dashed border-zinc-300 p-4">
      <div className="grid grid-flow-row grid-cols-4 gap-2">
        {filesPreviewURLs.length > 0 &&
          filesPreviewURLs.map((file, fileIndex) => {
            return (
              <div
                className={clsx("group relative aspect-square", {
                  "col-span-2 row-span-2 rounded-md bg-pink-200 p-4":
                    fileIndex === 0,
                })}
              >
                <IconButton
                  onClick={() => deleteFile(fileIndex)}
                  className="pointer-events-none right-2 top-2 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                  position={"absolute"}
                  icon={<TrashIcon className="h-5 w-5"></TrashIcon>}
                  aria-label="delete image"
                  colorScheme="red"
                ></IconButton>
                {file.isVideo && (
                  <video className="h-full w-full rounded-md object-cover" src={file.url} controls />
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
        {filesPreviewURLs.length > 0 && (
          <div
            {...getRootProps()}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-zinc-300 p-2"
          >
            <input {...getInputProps()} />
            <Badge>{isDragActive ? "Drop Here" : "Add files"}</Badge>
          </div>
        )}
      </div>

      {!(filesPreviewURLs.length > 0) && (
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
      )}
      {files.length > 0 && (
        <Button onClick={() => startUpload(files)} width={"full"}>
          Upload {files.length} files
        </Button>
      )}
    </div>
  );
}

export default UploadProductMedia;
