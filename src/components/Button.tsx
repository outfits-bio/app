interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'danger' | 'outline';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ size = 'md', color = 'outline', isLoading = false, ...props }: ButtonProps) => {
    let sizeClass = '';

    switch (size) {
        case 'sm':
            sizeClass = '';
            break;
        case 'md':
            sizeClass = 'px-6 h-10 rounded-sm';
            break;
        case 'lg':
            sizeClass = 'w-full h-12 rounded-md';
            break;
        default:
            break;
    }

    let colorClass = '';

    switch (color) {
        case 'primary':
            colorClass = 'btn-primary';
            break;
        case 'secondary':
            colorClass = 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold';
            break;
        case 'danger':
            colorClass = 'btn-danger';
            break;
        case 'outline':
            colorClass = 'border border-slate-400';
            break;
        default:
            break;
    }

    return <button className={`flex items-center justify-center gap-2 ${sizeClass} ${colorClass}`} {...props} />;
}