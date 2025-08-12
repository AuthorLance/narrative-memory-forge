import { EntryType, entryTypeConfig } from '@/types/writing';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoryGridProps {
  entryCounts: Record<EntryType, number>;
  onCategoryClick: (type: EntryType) => void;
  onCreateNew: (type: EntryType) => void;
}

export function CategoryGrid({ entryCounts, onCategoryClick, onCreateNew }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(Object.keys(entryTypeConfig) as EntryType[]).map((type) => {
        const config = entryTypeConfig[type];
        const count = entryCounts[type] || 0;

        return (
          <Card
            key={type}
            className="group cursor-pointer hover:shadow-creative transition-all duration-300 bg-gradient-subtle border-border/50"
            onClick={() => onCategoryClick(type)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {config.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNew(type);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-lg h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: count > 0 ? `${Math.min((count / 10) * 100, 100)}%` : '0%' }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}