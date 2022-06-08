import type { ToastStack, ToastStackItem, ToastOptions } from '../types';

export default function <P>(
  stackItem: ToastStackItem<P> | undefined,
  stack: ToastStack<P>
): ToastOptions {
  const stackItemOption = <K extends keyof ToastOptions>(
    key: K
  ): ToastOptions[K] =>
    stackItem?.component.modalOptions?.[key] ?? stackItem?.options?.[key];

  const extractOption = <K extends keyof ToastOptions>(
    key: K
  ): ToastOptions[K] =>
    stackItem?.component.modalOptions?.[key] ??
    stackItem?.options?.[key] ??
    stack.defaultOptions[key];

  return {
    position: extractOption('position'),
    backBehavior: extractOption('backBehavior'),
    backdropColor: extractOption('backdropColor'),
    containerStyle: extractOption('containerStyle'),
    animateInConfig: extractOption('animateInConfig'),
    backdropOpacity: extractOption('backdropOpacity'),
    animateOutConfig: extractOption('animateOutConfig'),
    transitionOptions: extractOption('transitionOptions'),
    disableFlingGesture: extractOption('disableFlingGesture'),
    backdropAnimationDuration: extractOption('backdropAnimationDuration'),
    /**
     * NOTE: In StackItem's updateAnimatedValue() we don't use the `animateIn/OutConfig` if
     * the `animateIn/Out` exists. However, those can be coming from the defaultOptions and
     * in the stackItem option, only `animateIn/OutConfig` would be defined. Hence the need
     * for this check so that the default `animateIn/Out` wouldn't override the stackItem
     * specific `animateIn/OutConfig`.
     */
    animationIn: stackItemOption('animateInConfig')
      ? undefined
      : extractOption('animationIn'),
    animationOut: stackItemOption('animateOutConfig')
      ? undefined
      : extractOption('animationOut'),
  };
}
