import React from 'react';

interface FormInputProps {
    value: string;
    onChange: (value: string) => void;
    type: string;
    placeholder: string;
    maxLength?: number;
    className?: string;
}

const FormInput: React.FC<FormInputProps> = (props) => {
    const {
        value,
        onChange,
        type = 'text',
        placeholder,
        maxLength = 100,
        className,
    } = props;

    return (
        <input
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                onChange(event.target.value)
            }
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            className={className}
        />
    );
};

export default FormInput;
