import { toast } from 'react-toastify';

const noop = () => null;
const noopPromise = () => Promise.resolve();
const noopIsActive = () => false;
const toastMethods = {
    success: noop,
    error: noop,
    warning: noop,
    warn: noop,
    info: noop,
    loading: noop,
    dismiss: noop,
    update: noop,
    isActive: noopIsActive,
    promise: noopPromise,
    configure: noop,
    clearWaitingQueue: noop,
};

Object.assign(toast, toastMethods);
