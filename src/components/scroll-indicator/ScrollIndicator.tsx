import { useCallback, useEffect, useState } from "react";
import type { ProductResponse, Product } from "./dataType";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Item, ItemTitle } from "@/components/ui/item";

interface propsType {
  url: string;
}

const ScrollIndicator = ({ url }: propsType) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const fetchList = useCallback(async (getUrl: string) => {
    try {
      setLoading(true);
      const res = await fetch(getUrl);
      const data: ProductResponse = await res.json();

      const hasProducts = data.products?.length > 0;
      if (hasProducts) {
        setData(data.products);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProgress = useCallback(() => {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (height > 0) {
      const scrollPercentage = (scrollTop / height) * 100;
      setProgress(scrollPercentage);
    }
  }, []);

  useEffect(() => {
    fetchList(url);
  }, [url, fetchList]);

  useEffect(() => {
    window.addEventListener("scroll", handleProgress);

    return () => {
      window.removeEventListener("scroll", handleProgress);
    };
  }, [handleProgress]);

  return (
    <div className="mx-auto my-10 flex w-full max-w-2xl flex-col justify-center px-4">
      <div className="fixed top-0 left-0 z-50 h-2 w-full bg-gray-200 backdrop-blur-sm">
        <div
          className="h-full bg-black transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {loading ? (
        <Item>
          <ItemTitle>Loading...</ItemTitle>
        </Item>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Scroll Indicator</CardTitle>
            <CardDescription>
              This is a feature to show the functionality of a scroll indicator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {data?.length > 0
                ? data.map((item, index) => (
                    <p
                      key={item.id}
                      className="border-muted border-b py-2 last:border-0"
                    >
                      <span className="font-semibold">{index + 1}.</span>{" "}
                      {item.title}
                    </p>
                  ))
                : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScrollIndicator;
