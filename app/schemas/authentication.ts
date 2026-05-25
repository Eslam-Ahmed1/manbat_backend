import z from 'zod'
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8)
})
const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
})

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "New password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and confirm password do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    })

export { registerSchema, loginSchema, changePasswordSchema };