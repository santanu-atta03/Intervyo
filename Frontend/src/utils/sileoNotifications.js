import { sileo } from "sileo";

let notificationSequence = 0;

const createNotificationId = (type) =>
  `intervyo-${type}-${Date.now()}-${++notificationSequence}`;

const dismissLoadingNotification = (options) => {
  if (options?.id) {
    sileo.dismiss(options.id);
  }
};

const createMessageOptions = (state, message, options = {}) => ({
  ...options,
  title: options.title || (state === "success" ? "Success" : "Something Went Wrong"),
  description: options.description || message,
  id: createNotificationId(state),
});

export const notify = {
  success: (message, options) => {
    dismissLoadingNotification(options);
    return sileo.success(createMessageOptions("success", message, options));
  },
  error: (message, options) => {
    dismissLoadingNotification(options);
    return sileo.error(createMessageOptions("error", message, options));
  },
  warning: (title) =>
    sileo.warning({ title, id: createNotificationId("warning") }),
  info: (title) => sileo.info({ title, id: createNotificationId("info") }),
  loading: (title) =>
    sileo.show({ type: "loading", title, id: createNotificationId("loading") }),
  action: (title, button) =>
    sileo.action({ title, button, id: createNotificationId("action") }),
  promise: (promise, options) => sileo.promise(promise, options),
  dismiss: (id) => {
    if (id) {
      sileo.dismiss(id);
    }
  },
};
