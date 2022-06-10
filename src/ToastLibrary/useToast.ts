import { useContext } from 'react';

import type { ToastParams, UsableToastProp } from '../types';

import ToastContext from './ToastContext';

/**
 * Hook that exposes toast API.
 *
 * @returns Object containing all the functions and variables of the usual `toast` prop.
 */

export default function <P extends ToastParams>(): UsableToastProp<P> {
  const context = useContext(ToastContext) as UsableToastProp<P>;

  return {
    /**
     * This function closes every open toast.
     *
     * @example toast.closeAllToasts(() => console.log('All Toasts closed'))
     *
     */
    closeAllToasts: () => {},
    /**
     * This value returns the current open modal (`null` if none).
     *
     * @example modal.currentModal
     *
     */
    currentToast: context.currentToast,
    /**
     * This function opens a modal based on the provided `modalName`.
     *
     * It will look at the stack passed to `<ModalProvider>` and add
     * the corresponding component to the current stack of open modals.
     * Alternatively, you can also provide some `params` that will be
     * accessible to that component.
     *
     * @example openModal('PokedexEntryModal', { id: 619, name: 'Lin-Fu' }, () => console.log('PokedexEntryModal modal opened'))
     *
     */
    openToast: context.openToast,
  };
}
