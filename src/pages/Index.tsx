import { useState } from 'react';
import { useWritingStorage } from '@/hooks/useWritingStorage';
import { EntryType, WritingEntry } from '@/types/writing';
import { CategoryGrid } from '@/components/CategoryGrid';
import { EntryCard } from '@/components/EntryCard';
import { EntryDialog } from '@/components/EntryDialog';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'dashboard' | 'category' | 'search';

const Index = () => {
  const { entries, isLoading, addEntry, updateEntry, deleteEntry, getEntriesByType, searchEntries } = useWritingStorage();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedType, setSelectedType] = useState<EntryType>('character');
  const [searchResults, setSearchResults] = useState<WritingEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: EntryType;
    entry?: WritingEntry;
  }>({
    isOpen: false,
    type: 'character'
  });

  // Calculate entry counts for each type
  const entryCounts = {
    character: getEntriesByType('character').length,
    place: getEntriesByType('place').length,
    plotpoint: getEntriesByType('plotpoint').length,
    goal: getEntriesByType('goal').length,
    ability: getEntriesByType('ability').length,
  };

  const handleCategoryClick = (type: EntryType) => {
    setSelectedType(type);
    setViewMode('category');
  };

  const handleCreateNew = (type: EntryType) => {
    setDialogState({ isOpen: true, type, entry: undefined });
  };

  const handleEditEntry = (entry: WritingEntry) => {
    setDialogState({ isOpen: true, type: entry.type, entry });
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Entry deleted",
      description: "Your entry has been successfully deleted.",
    });
  };

  const handleSaveEntry = (entryData: Omit<WritingEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (dialogState.entry) {
      updateEntry(dialogState.entry.id, entryData);
      toast({
        title: "Entry updated",
        description: "Your entry has been successfully updated.",
      });
    } else {
      addEntry(entryData);
      toast({
        title: "Entry created",
        description: "Your new entry has been successfully created.",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchEntries(query));
      setViewMode('search');
    } else {
      setViewMode('dashboard');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your writing assistant...</p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Writing Memory Forge
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your digital memory palace for characters, places, plots, and everything that makes your stories come alive.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <CategoryGrid
              entryCounts={entryCounts}
              onCategoryClick={handleCategoryClick}
              onCreateNew={handleCreateNew}
            />
          </div>
        );

      case 'category':
        const categoryEntries = getEntriesByType(selectedType);
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setViewMode('dashboard')}
                  className="hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s
                </h1>
              </div>
              <Button
                onClick={() => handleCreateNew(selectedType)}
                className="bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
            
            <SearchBar onSearch={handleSearch} />
            
            {categoryEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">📝</div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No entries yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start building your story by creating your first entry.
                </p>
                <Button
                  onClick={() => handleCreateNew(selectedType)}
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Entry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setViewMode('dashboard')}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Search Results for "{searchQuery}"
              </h1>
            </div>
            
            <SearchBar onSearch={handleSearch} />
            
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try different keywords or create a new entry.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
      
      <EntryDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
        type={dialogState.type}
        entry={dialogState.entry}
        onSave={handleSaveEntry}
      />
    </div>
  );
};

export default Index;