// SmartSchoolApp/src/components/RefreshableFlatList.tsx
import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, FlatListProps } from 'react-native';

type RefreshableFlatListProps<T> = FlatListProps<T> & {
  onReload: () => Promise<void> | void;
};

export default function RefreshableFlatList<T>({
  onReload,
  ...rest
}: RefreshableFlatListProps<T>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onReload();
    } finally {
      setRefreshing(false);
    }
  }, [onReload]);

  return (
    <FlatList
      {...rest}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}
