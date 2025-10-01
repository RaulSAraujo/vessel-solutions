import * as yup from 'yup';

export const authSchema = yup.object({
    email: yup
        .string()
        .email('O email deve ser válido')
        .required('O email é obrigatório'),
    password: yup
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .matches(/\d/, 'A senha deve conter pelo menos um número')
        .matches(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial')
        .required('A senha é obrigatória'),
});