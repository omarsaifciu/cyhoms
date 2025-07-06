
import { Label } from "@/components/ui/label";

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}
const ReadOnlyField = ({ label, value }: ReadOnlyFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">
        {label}
      </Label>
      <div
        className="
          p-3
          bg-gray-50
          text-gray-900
          rounded-lg
          transition-all
          duration-300
          hover:bg-gray-100
          dark:bg-[#23263a]
          dark:text-gray-100
          dark:hover:bg-[#23263a]
        "
      >
        {value || "-"}
      </div>
    </div>
  );
};
export default ReadOnlyField;

