type PendingOperation = {
    status: 'pending';
};

type OngoingOperation = {
    status: 'ongoing';
};

type SuccessfulOperation<T> = {
    status: 'successful';
    data: T;
};

type FailedOperation<E> = {
    status: 'failed';
    error?: E;
};

type AsyncOp<T, E> =
    | PendingOperation
    | OngoingOperation
    | SuccessfulOperation<T>
    | FailedOperation<E>;

module.exports = {
    AsyncOp,
};
