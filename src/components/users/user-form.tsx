"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  userFormDefaultValues,
  type UserFormValues,
  userFormSchemaWithContact,
} from "@/lib/schemas";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

interface UserFormProps {
  defaultUser?: User;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function UserForm({
  defaultUser,
  onSubmit,
  isSubmitting,
  onCancel,
}: UserFormProps) {
  const isEdit = !!defaultUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: standardSchemaResolver(userFormSchemaWithContact),
    defaultValues: defaultUser
      ? {
          name: defaultUser.name,
          username: defaultUser.username,
          email: defaultUser.email,
          phone: defaultUser.phone ?? "",
          website: defaultUser.website ? `https://${defaultUser.website}` : "",
          city: defaultUser.address?.city ?? "",
          company: defaultUser.company?.name ?? "",
        }
      : userFormDefaultValues,
    mode: "onBlur",
  });

  // useEffect(() => {
  //   if (defaultUser) {
  //     reset({
  //       name: defaultUser.name,
  //       username: defaultUser.username,
  //       email: defaultUser.email,
  //       phone: defaultUser.phone ?? '',
  //       website: defaultUser.website ? `https://${defaultUser.website}` : '',
  //       city: defaultUser.address?.city ?? '',
  //       company: defaultUser.company?.name ?? '',
  //     },{ keepDirty: true })
  //   }
  // }, [defaultUser, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Tên *</FieldLabel>
          <Input id="name" placeholder="Nguyen Van A" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.username}>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="nguyenvana"
            {...register("username")}
          />
          <FieldError errors={[errors.username]} />
        </Field>
      </div>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email *</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="a@example.com"
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" placeholder="0901234567" {...register("phone")} />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field data-invalid={!!errors.website}>
          <FieldLabel htmlFor="website">Website</FieldLabel>
          <Input
            id="website"
            placeholder="https://example.com"
            {...register("website")}
          />
          <FieldError errors={[errors.website]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.company}>
          <FieldLabel htmlFor="company">Công ty</FieldLabel>
          <Input
            id="company"
            placeholder="Acme Corp"
            {...register("company")}
          />
          <FieldError errors={[errors.company]} />
        </Field>

        <Field data-invalid={!!errors.city}>
          <FieldLabel htmlFor="city">Thành phố</FieldLabel>
          <Input id="city" placeholder="Hà Nội" {...register("city")} />
          <FieldError errors={[errors.city]} />
        </Field>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className=" 
          flex-1 
          font-semibold 
          transition-all  
          hover:bg-zinc-100  
          hover:shadow-  
          disabled:bg-zinc-300  
          disabled:text-zinc-50   
          disabled:border  
          disabled:border-zinc-300  
          disabled:shadow-none  
          disabled:cursor-not-allow  
          dark:disabled:bg-zinc-900  
          dark:disabled:text-zinc-400  
          dark:disabled:border-zinc-700"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {isEdit ? "Lưu thay đổi" : "Tạo user"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="
      border-zinc-300
      bg-white
      shadow-sm
      hover:bg-zinc-100
      hover:shadow-md
      transition-all

      dark:bg-zinc-900
      dark:border-zinc-700
    "
          >
            Hủy
          </Button>
        )}
      </div>
    </form>
  );
}
