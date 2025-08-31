import { useState } from "react";
import { useRouter } from "next/navigation";

const useLoadingRouter = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const routerPush = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  const routerReplace = (path: string) => {
    setLoading(true);
    router.replace(path);
  };

  return { loading, routerPush, routerReplace, router };
};

export default useLoadingRouter;
