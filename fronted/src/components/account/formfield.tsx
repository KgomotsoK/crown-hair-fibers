import { motion } from 'framer-motion';
import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import '../../styles/forms.css';

interface FormFieldProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  error?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
}

export const FormField = <T extends FieldValues>({ label, error, register, name, ...props }: FormFieldProps<T>) => (
  <motion.div 
    className="fields-cont"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label htmlFor={name}>{label}</label>
    <input id={name} {...register(name)} {...props} className={`form-input ${error ? 'input-error' : ''}`} />
    {error && (
      <motion.p 
        className="error-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);