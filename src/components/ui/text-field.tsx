import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { useImperativeHandle, useRef, useState, type Ref } from 'react';
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
  /** An icon at the start of the field (phone, mail, lock…). */
  icon?: LucideIcon;
  /** Password with a show / hide button. */
  secret?: boolean;
  showLabel?: string;
  hideLabel?: string;
  /** Phone numbers, emails, passwords and codes read left to right, also in Arabic. */
  ltr?: boolean;
  className?: string;
  /** The input itself, e.g. to move to the next field from the keyboard. */
  ref?: Ref<TextInput>;
}

/** Label above, hint below, a clear focus ring (UX_GUIDELINES "Field"). */
export function TextField({
  label,
  hint,
  invalid,
  icon: Icon,
  secret,
  showLabel,
  hideLabel,
  ltr,
  className,
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextFieldProps) {
  const colors = useColors();
  const arabic = useLocale() === 'ar';
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const input = useRef<TextInput>(null);
  useImperativeHandle(ref, () => input.current as TextInput, []);
  return (
    <View className="gap-2">
      <Text size="sm" weight="semibold">
        {label}
      </Text>
      <Pressable
        onPress={() => input.current?.focus()}
        accessible={false}
        className={cn(
          'min-h-[54px] flex-row items-center rounded-lg border-[1.5px] bg-card',
          invalid ? 'border-destructive' : focused ? 'border-primary' : 'border-input',
        )}
        style={[
          // Phone numbers, emails and passwords stay left to right in Arabic too,
          // otherwise "20 123 456" shows as "456 123 20" (as the web's dir="ltr").
          ltr ? { direction: 'ltr' } : null,
          focused && !invalid ? { boxShadow: `0px 0px 0px 3px ${colors.primary}26` } : null,
        ]}
      >
        {Icon ? (
          <View className="ps-4">
            <Icon size={20} color={focused ? colors.primary : colors.mutedForeground} />
          </View>
        ) : null}
        <TextInput
          ref={input}
          accessibilityLabel={label}
          accessibilityHint={hint}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={secret && !visible}
          cursorColor={colors.primary}
          selectionColor={`${colors.primary}55`}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          className={cn('min-h-[52px] flex-1 px-4 text-base text-foreground', className)}
          style={[
            {
              fontFamily: fontFamily(arabic && !ltr ? 'arabic' : 'latin', 'body', 'regular'),
            },
            ltr ? { writingDirection: 'ltr' } : null,
            style,
          ]}
          {...props}
          // Android lays out placeholders on their own: isolate them too.
          placeholder={
            ltr && props.placeholder ? `\u2066${props.placeholder}\u2069` : props.placeholder
          }
        />
        {secret ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? hideLabel : showLabel}
            onPress={() => setVisible((v) => !v)}
            className="h-[52px] w-12 items-center justify-center"
          >
            {visible ? (
              <EyeOff size={20} color={colors.mutedForeground} />
            ) : (
              <Eye size={20} color={colors.mutedForeground} />
            )}
          </Pressable>
        ) : null}
      </Pressable>
      {hint ? (
        <Text size="xs" className="text-muted-foreground">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const CODE_LENGTH = 6;

/**
 * The 6-digit code as six boxes, always left to right. One hidden field
 * underneath takes the input, so pasting and Android's SMS autofill work.
 */
export function CodeField({
  label,
  value,
  onChangeText,
  invalid,
  onComplete,
  labelHidden = false,
}: {
  label: string;
  /** The screen's title already says it; the label stays for screen readers. */
  labelHidden?: boolean;
  value: string;
  onChangeText: (value: string) => void;
  invalid?: boolean;
  /** Called once all six digits are there (pasted, typed or filled from the SMS). */
  onComplete?: (code: string) => void;
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(true);
  const input = useRef<TextInput>(null);
  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? '');
  return (
    <View className="gap-2">
      {labelHidden ? null : (
        <Text size="sm" weight="semibold">
          {label}
        </Text>
      )}
      <Pressable
        accessible={false}
        onPress={() => input.current?.focus()}
        className="flex-row justify-between gap-2"
        style={{ direction: 'ltr' }}
      >
        {digits.map((digit, index) => {
          const active = focused && index === Math.min(value.length, CODE_LENGTH - 1);
          return (
            <View
              key={index}
              className={cn(
                'h-14 flex-1 items-center justify-center rounded-lg border-[1.5px] bg-card',
                invalid ? 'border-destructive' : active ? 'border-primary' : 'border-input',
              )}
              style={
                active && !invalid
                  ? { boxShadow: `0px 0px 0px 3px ${colors.primary}26` }
                  : undefined
              }
            >
              <Text
                size="2xl"
                weight="semibold"
                style={{ fontFamily: fontFamily('latin', 'body', 'semibold') }}
              >
                {digit}
              </Text>
            </View>
          );
        })}
        <TextInput
          ref={input}
          accessibilityLabel={label}
          value={value}
          onChangeText={(text) => {
            const code = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
            onChangeText(code);
            if (code.length === CODE_LENGTH && value.length < CODE_LENGTH) onComplete?.(code);
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={CODE_LENGTH}
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          caretHidden
          className="absolute inset-0 text-transparent"
          style={{ color: 'transparent', opacity: 0.02 }}
          testID="code-field"
        />
      </Pressable>
    </View>
  );
}
