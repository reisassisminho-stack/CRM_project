import { PendingContactsList } from '../clients/PendingContactsList';

export function ClientContactSidebar() {
    return (
        <div className="h-full bg-slate-50/50">
            <PendingContactsList compact={true} />
        </div>
    );
}
