import React, { useState, useEffect } from 'react';

// Generic type for API fetch function
type FetchFunction<T> = () => Promise<T[]>;

// Generic type for rendering label
type LabelFunction<T> = (item: T) => string;

// Type for ID extraction that works with different entity shapes
type EntityIdFunction<T> = (item: T) => string;

interface EntitySelectProps<T> {
  fetchEntities: FetchFunction<T>;
  getLabelText: LabelFunction<T>;
  getEntityId: EntityIdFunction<T>;
  value?: string;
  onChange: (entityId: string) => void;
  className?: string;
  placeholder?: string;
  defaultToFirstEntity?: boolean;
}

export function EntitySelect<T>({ 
  fetchEntities, 
  getLabelText, 
  getEntityId,
  value, 
  onChange, 
  className = '', 
  placeholder = 'Select an item',
  defaultToFirstEntity = true
}: EntitySelectProps<T>) {
  const [entities, setEntities] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setIsLoading(true);
        const fetchedEntities = await fetchEntities();
        setEntities(fetchedEntities);
        
        // If no value is selected, entities exist, and defaultToFirstEntity is true
        if (!value && fetchedEntities.length > 0 && defaultToFirstEntity) {
          // Type assertion to handle potential undefined
          const firstEntity = fetchedEntities[0];
          if (firstEntity) {
            onChange(getEntityId(firstEntity));
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch entities';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntities();
  }, [fetchEntities, getEntityId, onChange, value, defaultToFirstEntity]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  if (isLoading) {
    return (
      <select 
        className={`${className} opacity-50 cursor-not-allowed`} 
        disabled
      >
        <option>Loading...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select 
        className={`${className} text-red-500`} 
        disabled
      >
        <option>{error}</option>
      </select>
    );
  }

  if (entities.length === 0) {
    return (
      <select 
        className={`${className} text-gray-500`} 
        disabled
      >
        <option>No items found</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`${className} p-2 border rounded`}
    >
      <option value="">{placeholder}</option>
      {entities.map((entity) => {
        const entityId = getEntityId(entity);
        return (
          <option 
            key={entityId} 
            value={entityId}
          >
            {getLabelText(entity)}
          </option>
        );
      })}
    </select>
  );
}