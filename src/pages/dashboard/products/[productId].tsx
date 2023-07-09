import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  HStack,
  Heading,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description, Media, Name, ProductStatus } from "@prisma/client";
import * as _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import AuthGaurd from "~/components/base/AuthGaurd";
import { SkeletonContext, SkeletonWrap } from "~/components/base/SkeletonWrap";
import AdminLayout from "~/components/layout/AdminLayout";
import { api } from "~/utils/api";
import { productSchema } from "~/validations/productSchema";

interface ProductFormValues {
  name: Name;
  media: Media[];
  description: Description;
  categories: string[];
  quantity: number;
  price: number;
  compareAtPrice?: number;
  status: ProductStatus;
  type: string;
}

function AdminPageProduct() {
  const router = useRouter();
  const toast = useToast();
  const productId = router.query.productId as string;

  const productQuery = api.product.get.useQuery({ id: productId });

  const editProductHook = api.product.edit.useMutation();
  const allCategoriesQuery = api.category.getAll.useQuery({});
  const deleteProduct = api.product.delete.useMutation();

  const [isChanged, setIsChanged] = useState(false);

  const categoriesData = useMemo(() => {
    if (!allCategoriesQuery.data) return [];
    return allCategoriesQuery.data.items.map((category) => ({
      value: category.id,
      label: category.name.en,
    }));
  }, [allCategoriesQuery]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    control,
    setValue,
  } = useForm<ProductFormValues>({
    mode: "onChange",
    resolver: zodResolver(productSchema),
    async defaultValues(payload) {
      const productData = (await productQuery.refetch()).data!;
      return {
        name: productData.name,
        description: productData.description,
        categories: productData.categoryIDs,
        media: productData.media,
        quantity: productData.quantity,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice || undefined,
        status: productData.status,
        type: productData.type,
      };
    },
  });

  const mediaValue = useWatch({ control, name: "media" });

  useEffect(() => {
    if (!productQuery.isFetched) reset();
  }, [productQuery.isFetched]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await editProductHook.mutateAsync({
        id: productId,
        media: data.media,
        name: data.name,
        description: {
          ar: data.description.ar || undefined,
          en: data.description.en || undefined,
        },
        categoryIDs: data.categories,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        quantity: data.quantity,
        status: data.status,
        type: data.type,
      });

      void productQuery.refetch();

      toast({
        title: "Product edited successfully",
        status: "success",
        description: `Edited ${data.name.en} successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (productQuery.data) {
      const formData = getValues();
      const productData = {
        name: { ...productQuery.data.name },
        description: { ...productQuery.data.description },
        categories: productQuery.data.categoryIDs,
        media: productQuery.data.media,
        quantity: productQuery.data.quantity,
        price: productQuery.data.price,
        compareAtPrice: productQuery.data.compareAtPrice || undefined,
        status: productQuery.data.status,
        type: productQuery.data.type,
      };

      if (_.isEqual(productData, formData)) {
        setIsChanged(false);
      } else {
        setIsChanged(true);
      }
    }
  }, [productQuery.data, getValues()]);

  function onDelete() {
    deleteProduct.mutate(
      { id: productId },
      {
        onError: (error) => {
          toast({
            title: "Failed to delete product",
            status: "error",
            description: error.message,
          });
          void router.push("/dashboard/products");
        },
        onSuccess: (data) => {
          toast({
            title: "Product deleted successfully",
            status: "success",
            description: `Deleted ${data.name.en} successfully`,
          });
          void router.push("/dashboard/products");
        },
      }
    );
  }
  return (
    <SkeletonContext.Provider value={productQuery.isLoading}>
      <AuthGaurd allowedLevel="STAFF">
        <AdminLayout>
          <DevTool control={control}></DevTool>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href={"/dashboard/products"}>
                <IconButton
                  icon={<ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>}
                  aria-label="back"
                  colorScheme="pink"
                />
              </Link>
              <SkeletonWrap>
                <Heading size={"md"}>{productQuery.data?.name.en}</Heading>
              </SkeletonWrap>
            </div>

            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>الخاصية غير متاحة مؤقتا</AlertTitle>
            </Alert>

            <Divider></Divider>
            <HStack justifyContent={"end"}>
              <Button colorScheme="red" variant={"outline"} onClick={onDelete}>
                Delete Product
              </Button>
            </HStack>
          </div>
        </AdminLayout>
      </AuthGaurd>
    </SkeletonContext.Provider>
  );
}



export default AdminPageProduct;
