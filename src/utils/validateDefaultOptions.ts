import type { ToastOptions } from '../types';

import invariant from './invariant';

export default function ({ position, opacity, transitionOptions }: ToastOptions = {}) {
  invariant(
    !opacity || (opacity && typeof opacity === 'number' && opacity >= 0 && opacity <= 1),
    'opacity should be a number between 0 and 1 in createModalStack()'
  );
  invariant(
    !position || (position && position === 'top') || (position && position === 'center') || (position && position === 'bottom'),
    "position should either be 'top', 'center' or 'bottom' in createModalStack()"
  );
  invariant(
    !transitionOptions || (transitionOptions && typeof transitionOptions === 'function'),
    `transitionOptions should be a function. For instance:
      const defaultModalOptions = {
        transitionOptions: animatedValue => ({
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        }),
      }
      }`
  );
}
