
export interface DropdownOption<T = any> {
    label: string;
    value: T;
    disabled?: boolean;
}

export interface DropdownConfig {
    placeholder?: string;
    searchPlaceholder?: string;
    allowSearch?: boolean;
    allowSort?: boolean;
    multiSelect?: boolean;
    allowAdd?: boolean;
    addLabel?: string;
    showSuccessModal?: boolean;
    i18nPrefix?: string;
    // New validation configurations
    addRequired?: boolean;
    allowedCharacters?: 'alpha' | 'numeric' | 'alphanumeric' | 'all';
    required?: boolean;
}
