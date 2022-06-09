import { useContext } from 'react';

import type { ToastParams, UsableToastProp } from '../types';

import ToastContext from './ToastContext';
import { toast } from './ToastState';

/**
 * Hook that exposes toast API.
 *
 * @returns Object containing all the functions and variables of the usual `toast` prop.
 */

export default function <P extends ToastParams>(): UsableToastProp<P> {
  const context = useContext(ToastContext) as UsableToastProp<P>;
  const { closeToast, closeToasts, closeAllToasts } = toast<P>();

  return {
    /**
     * This function closes every open toast.
     *
     * @example toast.closeAllToasts(() => console.log('All Toasts closed'))
     *
     */
    closeAllToasts: closeAllToasts as UsableToastProp<P>['closeAllToasts'],
    /**
     * This function closes the currently displayed modal by default.
     *
     * You can also provide a `modalName` if you want to close a different modal
     * than the latest opened. This will only close the latest instance of that modal,
     * see `closeToast()` if you want to close all instances.
     *
     * @example modal.closeToast('Example', () => console.log('Current modal closed'))
     *
     */
    closeToast: closeToast as UsableToastProp<P>['closeToast'],
    /**
     * This function closes all the instances of a given modal.
     *
     * You can use it whenever you have the same modal opened
     * several times, to close all of them at once.
     *
     * @example modal.closeModals('ExampleModal', () => console.log('All ExampleModal modals closed'))
     *
     * @returns { boolean } Whether or not Modalfy found any open modal
     * corresponding to `modalName` (and then closed them).
     *
     */
    closeToasts: closeToasts as UsableToastProp<P>['closeToasts'],
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
