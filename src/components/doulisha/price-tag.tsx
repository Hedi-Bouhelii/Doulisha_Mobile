import { Text, type TextSize } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/shared/web/i18n';

/** "From 45 DT" or "Free". Amounts are integer millimes; prices keep Latin digits in Arabic. */
export function PriceTag({
  millimes,
  from = true,
  size = 'sm',
  className,
}: {
  millimes: number | null;
  from?: boolean;
  size?: TextSize;
  className?: string;
}) {
  const t = useT('Event');
  const locale = useLocale();
  if (millimes === null || millimes === 0) {
    return (
      <Text size={size} weight="semibold" className={cn('text-primary', className)}>
        {t('free')}
      </Text>
    );
  }
  const price = formatPrice(millimes, locale);
  return (
    <Text size={size} weight="semibold" className={className}>
      {from ? t('from', { price }) : price}
    </Text>
  );
}
