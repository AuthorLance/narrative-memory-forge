import { useState } from 'react';
import { WritingEntry, EntryType, entryTypeConfig } from '@/types/writing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface EntryFormProps {
  type: EntryType;
  entry?: WritingEntry;
  onSave: (entry: Omit<WritingEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function EntryForm({ type, entry, onSave, onCancel }: EntryFormProps) {
  const config = entryTypeConfig[type];
  const [formData, setFormData] = useState({
    name: entry?.name || '',
    description: entry?.description || '',
    tags: entry?.tags || [],
    ...Object.fromEntries(
      config.fields.map(field => [field, (entry as any)?.[field] || ''])
    )
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      type,
    } as any);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderField = (field: string) => {
    const value = (formData as any)[field] || '';
    
    switch (field) {
      case 'importance':
      case 'priority':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => setFormData(prev => ({ ...prev, [field]: newValue }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'status':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => setFormData(prev => ({ ...prev, [field]: newValue }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
            placeholder={`Enter ${field}`}
            className="min-h-20"
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <h2 className="text-xl font-semibold">
          {entry ? 'Edit' : 'Create'} {config.singular}
        </h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder={`Enter ${config.singular.toLowerCase()} name`}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder={`Describe this ${config.singular.toLowerCase()}`}
          className="min-h-24"
        />
      </div>

      {config.fields.map(field => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="capitalize">
            {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </Label>
          {renderField(field)}
        </div>
      ))}

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-gradient-primary text-primary-foreground">
          {entry ? 'Update' : 'Create'} {config.singular}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}