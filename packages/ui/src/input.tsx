import { InputHTMLAttributes } from "react";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  className?: string;
  type: string;
  placeholder?: string;
}

export const Input = ({
  className = "",
  type,
  placeholder,
  ...props
}: InputProps) => {
  return (
    <input
      placeholder={placeholder}
      className={`px-3 py-1 
                border border-gray-300 dark:border-[#383838]
                w-full
                rounded-xl
                bg-white dark:bg-[#151515] 
                text-gray-900 dark:text-gray-100 
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-[#989696]
                dark:focus:outline-none dark:focus:ring-4 dark:focus:ring-zinc-800 dark:focus:border-[#5d5d5d]
                transition-colors duration-200
                ${className}
            `
        .trim()
        .replace(/\s+/g, " ")}
      type={type}
      {...props}
    />
  );
};
