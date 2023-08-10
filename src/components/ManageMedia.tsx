import { cn } from "@/lib/utils";
import { Badge, IconButton, Skeleton, useToast } from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import type { Media } from "@prisma/client";
import clsx from "clsx";
import * as _ from "lodash";
import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { OurFileRouter } from "~/server/uploadthing";
import { api } from "~/utils/api";
import { useUploadThing } from "~/utils/uploadthing";

interface State {
  media: Media[];
}

enum MediaActionType {
  DELETE = "DELETE",
  ADD = "ADD",
  SET = "SET",
}

interface MediaAction {
  type: MediaActionType;
  payload: Media[];
  onChange: (state: Media[]) => void;
}

function reducer(state: State, action: MediaAction) {
  let newState: State = { media: [] };
  if (action.type === MediaActionType.ADD) {
    newState = {
      media: [...state.media, ...action.payload],
    };
  } else if (action.type === MediaActionType.DELETE) {
    const payloadMediaKeys = action.payload.map((media) => media.key);
    newState = {
      media: state.media.filter(
        (media) => !payloadMediaKeys.includes(media.key)
      ),
    };
  } else if (action.type === MediaActionType.SET) {
    if (_.isEqual(state.media.sort(), action.payload.sort())) {
      return state;
    }

    newState = {
      media: action.payload,
    };
  }

  if (newState) {
    console.log("changed");
    action.onChange(newState.media);
    return newState;
  }

  throw Error("Unknown action.");
}

const ManageMedia = forwardRef(
  ({
    value,
    onChange,
    endpoint,
    max = 10,
  }: {
    endpoint: keyof OurFileRouter;
    value?: Media[];
    max?: number;
    onChange: (fileURLs: Media[]) => void;
  }) => {
    const toast = useToast({ duration: 3000 });
    const deleteMedia = api.media.deleteMany.useMutation();
    const [uploadingFilesCount, setUploadingFilesCount] = useState(0);
    const [state, dispatch] = useReducer(reducer, { media: [] });

    useEffect(() => {
      if (value && value.length > 0) {
        dispatch({ type: MediaActionType.SET, payload: value, onChange });
      }
    }, [value, onChange]);

    function onMediaDelete(key: string) {
      const media = state.media.find((media) => media.key === key);
      if (media) {
        dispatch({ payload: [media], type: MediaActionType.DELETE, onChange });

        deleteMedia.mutate(
          { fileKeys: [key] },
          {
            onError(error) {
              toast({
                title: "Error occurred while deleting media",
                status: "error",
                description: error.message,
              });

              dispatch({
                payload: [media],
                type: MediaActionType.ADD,
                onChange,
              });
            },
            onSuccess() {
              toast({
                title: "Media deleted successfully",
                status: "success",
              });
            },
          }
        );
      }
    }

    const { startUpload } = useUploadThing(endpoint, {
      onClientUploadComplete: () => {
        console.log("uploaded successfully!");
      },
      onUploadError: () => {
        console.log("error occurred while uploading");
      },
    });

    const onDrop = useCallback(
      async (acceptedFiles: FileWithPath[]) => {
        setUploadingFilesCount((state) => state + acceptedFiles.length);
        const acceptedFilesWithType = acceptedFiles.map((file) => ({
          file,
          isVideo: file.type.includes("video"),
        }));

        try {
          const result = await startUpload(acceptedFiles);

          if (result) {
            setUploadingFilesCount((state) => state - result.length);

            if (state.media.length + result.length > max) {
              toast({
                title: `Maximum number of media (${max}) reached`,
                status: "error",
              });

              return;
            }

            dispatch({
              type: MediaActionType.ADD,
              payload: result.map((file, index) => {
                return {
                  key: file.fileKey,
                  isVideo: acceptedFilesWithType[index]?.isVideo || false,
                  url: file.fileUrl,
                  name: acceptedFilesWithType[index]?.file.name,
                  size: acceptedFilesWithType[index]?.file.size,
                } as Media;
              }),
              onChange,
            });

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
      },
      [max, onChange, toast, state.media.length, startUpload]
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => void onDrop(acceptedFiles),
      accept: generateClientDropzoneAccept(["image", "video"]),
    });

    if (state.media.length > 0 || uploadingFilesCount > 0)
      return (
        <div className="grid grid-flow-row gap-2 rounded-md border-2 border-dashed p-4 [grid-template-columns:_repeat(4,_minmax(0,_1fr));]">
          {state.media.map(
            (media, index) =>
              media && (
                <MediaItem
                  key={media.key}
                  media={media}
                  onDelete={() => onMediaDelete(media.key)}
                  big={index === 0}
                />
              )
          )}

          {Array.from({ length: uploadingFilesCount })
            .fill("d")
            .map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="relative col-span-2 row-span-2 flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-2 text-center md:col-span-1 md:row-span-1"
              >
                <Badge
                  position={"absolute"}
                  top={4}
                  left={4}
                  zIndex={30}
                  size={"xs"}
                >
                  Uploading
                </Badge>
                <Skeleton className="h-full w-full"></Skeleton>
              </div>
            ))}

          <div
            className={clsx(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-2 text-center",
              {
                "pointer-events-none cursor-not-allowed bg-zinc-200":
                  state.media.length >= max,
              }
            )}
            {...getRootProps()}
          >
            {state.media.length >= max ? (
              <>
                <Badge>Maxed</Badge>
                <span className="text-xs">Max number of media reached</span>
              </>
            ) : (
              <>
                <input
                  {...getInputProps()}
                  disabled={state.media.length >= max}
                />
                <Badge>ADD</Badge>
                <span className="text-xs">Images, or videos</span>
              </>
            )}
          </div>
        </div>
      );

    return (
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4"
      >
        <input {...getInputProps()} className="h-full w-full" />
        <Badge>ADD MEDIA</Badge>
        <span className="text-sm">Accepts images, or videos</span>
      </div>
    );
  }
);

ManageMedia.displayName = "ManageMedia";

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
      className={cn("group relative aspect-square rounded-md border p-0.5", {
        "col-span-2 row-span-2 p-1": big,
      })}
    >
      <IconButton
        onClick={onDelete}
        className="pointer-events-none right-2 top-2 z-50 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
        position={"absolute"}
        icon={
          <TrashIcon
            className={clsx({ "h-5 w-5": big, "h-4 w-4": !big })}
          ></TrashIcon>
        }
        aria-label="delete image"
        colorScheme="red"
        size={big ? "sm" : "xs"}
      ></IconButton>

      <div className="duration-400 pointer-events-none absolute inset-0 z-40 h-full w-full rounded-md bg-black opacity-0 group-hover:pointer-events-auto group-hover:opacity-30"></div>

      {media.isVideo && (
        <video
          controls
          className="h-full w-full rounded-md object-contain"
          src={media.url}
        ></video>
      )}

      {!media.isVideo && (
        <Image
          src={media.url}
          width={256}
          height={256}
          alt={media.key}
          className="h-full w-full rounded-md object-contain"
        />
      )}
    </div>
  );
}

export default ManageMedia;
