import { type ReactNode } from 'react';

interface BaseCardProps {
    title: string;
    onEdit?: (id: string | undefined) => void;
    onDelete?: (id: string | undefined) => void;
    recordId?: string;
    showDeleteConfirm?: boolean;
    children?: ReactNode;
}

export const BaseCard = ({
    title,
    onEdit,
    onDelete,
    recordId,
    showDeleteConfirm = true,
    children = null,
}: BaseCardProps) => {
    const handleEdit = () => {
        if (onEdit) {
            onEdit(recordId);
        }
    };

    const handleDelete = () => {
        if (showDeleteConfirm) {
            if (window.confirm('Are you sure you want to delete this record?') && onDelete) {
                onDelete(recordId);
            }
        } else if (onDelete) {
            onDelete(recordId);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
};