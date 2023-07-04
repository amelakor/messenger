"use client";
import axios from "axios";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { sign } from "crypto";

type Variant = "login" | "register";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("login");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/users");
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        setVariant((prev) => (prev === "login" ? "register" : "login"));
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        if (variant === "login") {
            signIn("credentials", {
                ...data,
                redirect: false,
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials");
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged in successfully");
                    router.push("/users");
                }
            });
        } else {
            axios
                .post("/api/register", data)
                .then(() => signIn("credentials", data))
                .catch((err) => toast.error("Something went wrong"));
        }
        setIsLoading(false);
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, {
            redirect: false,
        }).then((callback) => {
            if (callback?.error) {
                toast.error("Something went wrong");
            }

            if (callback?.ok && !callback?.error) {
                toast.success("Logged in successfully");
            }
        });

        setIsLoading(false);
    };

    return (
        <div
            className="
                mt-8
                sm:mx-auto 
                sm:w-full 
                sm:max-w-md
            "
        >
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "register" && (
                        <Input
                            id="name"
                            label="Name"
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === "login" ? "Login" : "Register"}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                                absolute 
                                inset-0 
                                flex 
                                items-center
                            "
                        >
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction("github")}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction("google")}
                        />
                    </div>
                </div>
                <div
                    className="
                        flex 
                        gap-2 
                        justify-center 
                        text-sm 
                        mt-6 
                        px-2 
                        text-gray-500
                    "
                >
                    <div>
                        {variant === "login"
                            ? "New to Messenger?"
                            : "Already have an account?"}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === "login" ? "Create an account" : "Login"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
