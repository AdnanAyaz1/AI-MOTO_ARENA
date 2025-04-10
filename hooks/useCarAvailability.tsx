import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Available
        </Badge>
      );
    case "UNAVAILABLE":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Unavailable
        </Badge>
      );
    case "SOLD":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Sold
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
