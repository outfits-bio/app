/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const formatErrors = (e: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const zodError = e.data?.zodError;

  if (zodError && zodError.fieldErrors) {
    return zodError.fieldErrors.token as string[];
  } else {
    if (e.data) {
      if (e.data.code && e.data.code === "UNAUTHORIZED") {
        return ["Unauthorized"];
      }

      return [e.message as string];
    }
  }
};

interface HandleErrorsProps {
  e: any;
  message?: string;
  fn?: () => any;
}

export const handleErrors = ({ e, message, fn }: HandleErrorsProps) => {
  const errors = formatErrors(e);

  if (errors) {
    errors.forEach((error) => toast.error(error));

    fn && void fn();
    return;
  }

  toast.error(message || "Something went wrong");

  fn && void fn();
  return;
};
