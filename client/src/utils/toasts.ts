import toast from "react-hot-toast";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
  });
};
