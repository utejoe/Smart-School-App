// SmartSchoolApp/src/components/RefreshableFlatList.tsx
import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';

type RefreshableFlatListProps = {
  onReload: () => Promise<void> | void; // function to call when refreshing
  [key: string]: any; // pass all other FlatList props
};

export default function RefreshableFlatList({
  onReload,
  ...rest
}: RefreshableFlatListProps) {
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
