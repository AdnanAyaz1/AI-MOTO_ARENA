import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";

interface PasswordToggleProps {
  togglePasswordType: (fieldName: string) => void;
  fieldName: string;
}

const PasswordToggle = ({
  togglePasswordType,
  fieldName,
}: PasswordToggleProps) => {
  const [showIcon, setShowIcon] = useState(false);
  const handleClick = () => {
    setShowIcon(!showIcon);
    togglePasswordType(fieldName);
  };
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer absolute right-4 top-1/3"
    >
      {showIcon ? (
        <EyeIcon className="size-5" />
      ) : (
        <EyeClosedIcon className="size-5" />
      )}
    </div>
  );
};

export default PasswordToggle;
