import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { cn } from '@/lib/cn';

/**
 * "7 places left" / "Full". Terracotta when 20% of places or fewer remain,
 * to create urgency without shouting (as on the web).
 */
export function PlacesLeft({
  capacity,
  left,
  className,
}: {
  capacity: number | null;
  left: number | null;
  className?: string;
}) {
  const t = useT('Event');
  if (capacity === null || left === null) {
    return (
      <Text size="sm" className={cn('text-muted-foreground', className)}>
        {t('unlimited')}
      </Text>
    );
  }
  const urgent = left === 0 || left / capacity <= 0.2;
  return (
    <Text
      size="sm"
      weight="medium"
      className={cn(urgent ? 'text-highlight' : 'text-muted-foreground', className)}
    >
      {t('placesLeft', { count: left })}
    </Text>
  );
}
