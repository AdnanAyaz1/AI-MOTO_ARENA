import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CarCardSkeleton = () => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group pt-0 pb-1 rounded-lg">
      <div className="relative border-b-[1px] border-gray-400 overflow-hidden">
        <Skeleton className="h-[200px] w-full rounded-tr-lg rounded-tl-lg" />
      </div>

      <CardContent className="p-4">
        <div className="flex flex-col mb-2">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-7 w-1/3" />
        </div>

        <div className="flex items-center mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 mx-2" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export default CarCardSkeleton;
