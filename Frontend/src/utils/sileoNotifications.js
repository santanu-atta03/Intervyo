import { sileo } from "sileo";

const dismissLoadingNotification = (options) => {
  if (options?.id) {
    sileo.dismiss(options.id);
  }
};

export const notify = {
  success: (title, options) => {
    dismissLoadingNotification(options);
    return sileo.success({ title });
  },
  error: (title, options) => {
    dismissLoadingNotification(options);
    return sileo.error({ title });
  },
  warning: (title) => sileo.warning({ title }),
  info: (title) => sileo.info({ title }),
  loading: (title) => sileo.show({ type: "loading", title }),
  action: (title, button) => sileo.action({ title, button }),
  promise: (promise, options) => sileo.promise(promise, options),
  dismiss: (id) => {
    if (id) {
      sileo.dismiss(id);
    }
  },
};
