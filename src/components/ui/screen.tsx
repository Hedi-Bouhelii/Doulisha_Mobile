import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { cn } from '@/lib/cn';

/** A scrolling page with the standard 16 px side margins. */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName={cn('grow gap-4 p-4', className)}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
