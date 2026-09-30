import { useCallback } from 'react';

import { errorMessageKey } from './error-keys';
import { hasMessage, useT } from './index';

export { authErrorKey } from './error-keys';

/** Translates any error into a sentence for the person. */
export function useErrorMessage() {
  const tErrors = useT('Errors');
  const tApp = useT('App');
  return useCallback(
    (error: unknown): string => {
      const key = errorMessageKey(error, hasMessage);
      if (key === 'App.offlineError') return tApp('offlineError');
      return tErrors(key.slice('Errors.'.length) as Parameters<typeof tErrors>[0]);
    },
    [tErrors, tApp],
  );
}
