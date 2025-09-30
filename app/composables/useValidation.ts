// composables/useValidation.ts
import * as yup from 'yup';

export function useValidation() {
    const rules = {
        required: (value: string) => !!value || 'Campo obrigatório.',
        email: (value: string) => {
            if (!value) return true; // Email is optional if not required
            return /.+@.+\..+/.test(value) || 'E-mail inválido.';
        },
        min: (value: string, length: number) => (value && value.length >= length) || `Mínimo de ${length} caracteres.`,
        max: (value: string, length: number) => (value && value.length <= length) || `Máximo de ${length} caracteres.`,
        numeric: (value: string) => {
            if (!value) return true;
            return /^\d+$/.test(value) || 'Deve ser um número.';
        },
        // Adicione mais regras conforme necessário
    };

    // Você pode usar Yup para esquemas de validação mais complexos
    const clientSchema = yup.object({
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('E-mail inválido').nullable(),
        phone: yup.string().nullable(),
        tax_id: yup.string().nullable(),
        address: yup.string().nullable(),
        city: yup.string().nullable(),
    });

    // Exemplo de uso com Vee-validate (em um componente)
    // import { useForm } from 'vee-validate';
    // const { defineField, handleSubmit, errors } = useForm({
    //   validationSchema: clientSchema,
    // });
    // const [name, nameProps] = defineField('name');

    return {
        rules,
        clientSchema,
        // ... outros esquemas
    };
}