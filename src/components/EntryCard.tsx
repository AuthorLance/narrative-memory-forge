import { WritingEntry, entryTypeConfig } from '@/types/writing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EntryCardProps {
  entry: WritingEntry;
  onEdit: (entry: WritingEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const config = entryTypeConfig[entry.type];

  return (
    <Card className="group hover:shadow-creative transition-all duration-300 bg-gradient-subtle border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {entry.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {config.singular}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(entry)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(entry.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {entry.description}
        </p>
        
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Created {format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}