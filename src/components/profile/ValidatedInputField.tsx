
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ValidatedInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isEditing: boolean;
  error?: string;
  isRequired?: boolean;
}

const ValidatedInputField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  isEditing, 
  error, 
  isRequired = false 
}: ValidatedInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium
        text-gray-700
        dark:text-gray-100" // <--- لون عنوان الحقل في الدارك مود
      >
        {label} {isRequired && <span className="text-red-500">*</span>}
      </Label>
      {isEditing ? (
        <div className="space-y-1">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`transition-all duration-300 focus:ring-2 ${
              error 
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-pink-500'
            } 
            dark:bg-[#23263a] dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-[#23263a]
            `}
            placeholder={placeholder}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <div className="p-3 bg-gray-50 dark:bg-[#23263a] dark:text-gray-100 rounded-lg text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#23263a]">
          {value || '-'}
        </div>
      )}
    </div>
  );
};

export default ValidatedInputField;

