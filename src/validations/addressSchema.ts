import { z } from "zod";
import { nameValidation } from "./common";
import { COUNTRIES } from "~/config/commonConfig";

/*


interface AddressFormValues {
  fullName: string;
  phoneCode: string;
  phoneNumber: string;
  type: "HOME" | "OFFICE";
  country: "BH" | "KW" | "OM" | "QA" | "SA" | "AE";
  streetName: string;
  buildingNumber: string;
  city: string;
  area: string;
  province: string;
  nearestLandmark: string;
}


*/

export const addressSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneCode: z.string().min(1, { message: "Phone code is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  streetName: z.string().min(1, { message: "Street name is required" }),
  buildingNumber: z.string().min(1, { message: "Building number is required" }),
  city: z.string().min(1, { message: "City is required" }),
  // area: z.string().min(1, { message: "Area is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  nearestLandmark: z.string().optional(),
  country: z.enum(["BH", "KW", "OM", "QA", "SA", "AE"]),
  type: z.enum(["HOME", "OFFICE"]),
});
