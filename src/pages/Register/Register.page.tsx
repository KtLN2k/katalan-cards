import { Button, FloatingLabel } from "flowbite-react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { registerSchema } from "../../validations/register.joi";
import axios from "axios";

export type FormData = {
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  phone: string;
  email: string;
  password: string;
  image?: {
    url: string;
    alt: string;
  };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
  isBusiness: boolean;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: { first: "", middle: "", last: "" },
      email: "",
      password: "",
      phone: "",
      image: { url: "", alt: "" },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: 0,
        zip: 0,
      },
      isBusiness: false,
    },
    resolver: joiResolver(registerSchema),
    mode: "onChange",
  });

  const submitForm = async (data: FormData) => {
    try {
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        data,
      );
      console.log("Success!");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-4xl rounded-xl bg-white p-10 shadow-xl dark:bg-gray-800">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Create an Account
        </h2>
        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {/* Section 1: Personal Info */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Personal Info
            </h3>
            <FloatingLabel
              variant={"filled"}
              {...register("name.first")}
              label="First Name"
              type="text"
            />
            {errors.name?.first && (
              <p className="text-sm text-red-500">
                {errors.name.first.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("name.middle")}
              label="Middle Name"
              type="text"
            />
            {errors.name?.middle && (
              <p className="text-sm text-red-500">
                {errors.name.middle.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("name.last")}
              label="Last Name"
              type="text"
            />
            {errors.name?.last && (
              <p className="text-sm text-red-500">{errors.name.last.message}</p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("phone")}
              label="Phone"
              type="tel"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Section 2: Account & Image */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Account & Image
            </h3>
            <FloatingLabel
              variant={"filled"}
              {...register("email")}
              label="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("password")}
              label="Password"
              type="password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("image.url")}
              label="Image URL"
              type="url"
            />
            {errors.image?.url && (
              <p className="text-sm text-red-500">{errors.image.url.message}</p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("image.alt")}
              label="Image Alt Text"
              type="text"
            />
            {errors.image?.alt && (
              <p className="text-sm text-red-500">{errors.image.alt.message}</p>
            )}

            <label className="mt-2 flex items-center gap-2">
              <input type="checkbox" {...register("isBusiness")} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Business Account
              </span>
            </label>
          </div>

          {/* Section 3: Address */}
          <div className="flex flex-col gap-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
              Address
            </h3>
            <FloatingLabel
              variant={"filled"}
              {...register("address.state")}
              label="State"
              type="text"
            />
            {errors.address?.state && (
              <p className="text-sm text-red-500">
                {errors.address.state.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("address.country")}
              label="Country"
              type="text"
            />
            {errors.address?.country && (
              <p className="text-sm text-red-500">
                {errors.address.country.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("address.city")}
              label="City"
              type="text"
            />
            {errors.address?.city && (
              <p className="text-sm text-red-500">
                {errors.address.city.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("address.street")}
              label="Street"
              type="text"
            />
            {errors.address?.street && (
              <p className="text-sm text-red-500">
                {errors.address.street.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("address.houseNumber")}
              label="House Number"
              type="number"
            />
            {errors.address?.houseNumber && (
              <p className="text-sm text-red-500">
                {errors.address.houseNumber.message}
              </p>
            )}

            <FloatingLabel
              variant={"filled"}
              {...register("address.zip")}
              label="Zip Code"
              type="number"
            />
            {errors.address?.zip && (
              <p className="text-sm text-red-500">
                {errors.address.zip.message}
              </p>
            )}
          </div>

          {/* Submit Button (spans all columns) */}
          <div className="md:col-span-3">
            <Button type="submit" className="mt-4 w-full" color="purple">
              Register
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
