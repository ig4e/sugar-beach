import { Button } from "@chakra-ui/react";
import { Media } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ManageProductMedia from "~/components/ManageMedia";

interface MediaForm {
  media: Media[];
}

function test() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    control,
    setValue,
  } = useForm<MediaForm>({
    mode: "onChange",
    defaultValues: {
      media: []
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))} className="m-16 max-w-md">
      <Controller
        control={control}
        name="media"
        render={({ field }) => (
          <ManageProductMedia
            endpoint="productMedia"
            onChange={field.onChange}
            value={field.value}
          ></ManageProductMedia>
        )}
      ></Controller>

          <Button type="submit">Sub</Button>

    </form>
  );
}

export default test;
