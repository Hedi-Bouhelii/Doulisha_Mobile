import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { useLocale } from '@/i18n';
import { cn } from '@/lib/cn';
import { fontFamily } from '@/theme/fonts';
import { useColors } from '@/theme/theme-provider';

import { Text } from './text';

export interface TextFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  /** Marks the field as the one to fix (red border). */
  invalid?: boolean;
  /** Password with a show / hide button. */
  secret?: boolean;
  showLabel?: string;
  hideLabel?: string;
  className?: string;
}

/** Label above the field, optional hint below (UX_GUIDELINES "Field"). */
export function TextField({
  label,
  hint,
  invalid,
  secret,
  showLabel,
  hideLabel,
  className,
  style,
  ...props
}: TextFieldProps) {
  const colors = useColors();
  const arabic = useLocale() === 'ar';
  const [visible, setVisible] = useState(false);
  return (
    <View className="gap-1.5">
      <Text size="sm" weight="medium">
        {label}
      </Text>
      <View className="justify-center">
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={hint}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={secret && !visible}
          className={cn(
            'min-h-12 rounded-md border bg-card px-4 text-base text-foreground',
            invalid ? 'border-destructive' : 'border-input',
            secret && 'pe-12',
            className,
          )}
          style={[
            { fontFamily: fontFamily(arabic ? 'arabic' : 'latin', 'body', 'regular') },
            style,
          ]}
          {...props}
        />
        {secret ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? hideLabel : showLabel}
            onPress={() => setVisible((v) => !v)}
            className="absolute end-0 h-12 w-12 items-center justify-center"
          >
            {visible ? (
              <EyeOff size={18} color={colors.mutedForeground} />
            ) : (
              <Eye size={18} color={colors.mutedForeground} />
            )}
          </Pressable>
        ) : null}
      </View>
      {hint ? (
        <Text size="xs" className="text-muted-foreground">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/** The 6-digit code: one field, digits spaced out, filled from the SMS when Android offers it. */
export function CodeField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const colors = useColors();
  return (
    <View className="gap-1.5">
      <Text size="sm" weight="medium">
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={6}
        autoFocus
        placeholder="••••••"
        placeholderTextColor={colors.mutedForeground}
        className="min-h-14 rounded-md border border-input bg-card px-4 text-center text-2xl text-foreground"
        style={{ fontFamily: fontFamily('latin', 'body', 'semibold'), letterSpacing: 8 }}
        testID="code-field"
      />
    </View>
  );
}
