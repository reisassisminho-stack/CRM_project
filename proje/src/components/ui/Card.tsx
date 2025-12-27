
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    action?: React.ReactNode;
}

export function Card({ className, title, action, children, ...props }: CardProps) {
    return (
        <div className={twMerge("bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden", className)} {...props}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    {title && <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
