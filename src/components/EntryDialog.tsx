import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EntryForm } from './EntryForm';
import { WritingEntry, EntryType } from '@/types/writing';

interface EntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: EntryType;
  entry?: WritingEntry;
  onSave: (entry: Omit<WritingEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function EntryDialog({ isOpen, onClose, type, entry, onSave }: EntryDialogProps) {
  const handleSave = (entryData: Omit<WritingEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSave(entryData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Entry Form</DialogTitle>
        </DialogHeader>
        <EntryForm
          type={type}
          entry={entry}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}