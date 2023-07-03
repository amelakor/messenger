"use client";
import clsx from "clsx";

interface ButtonProps {
    type?: "button" | "submit" | "reset" | undefined;
    fullWidth?: boolean;
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    type = "button",
    fullWidth = false,
    children,
    variant = "primary",
    disabled = false,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={clsx(
                `
            flex
            justify-center
            py-2
            px-4
            border
            border-transparent
            shadow-sm
            text-sm
            font-medium
            rounded-md
            text-white
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-sky-500
            `,
                fullWidth && "w-full",
                variant === "primary" && "bg-sky-600 hover:bg-sky-700",
                variant === "secondary" && "bg-gray-300 hover:bg-gray-400",
                variant === "danger" && "bg-rose-600 hover:bg-rose-700",
                disabled && "opacity-50 cursor-default"
            )}
        >
            {children}
        </button>
    );
};

export default Button;
