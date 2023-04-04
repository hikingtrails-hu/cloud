export interface WorkerMessage<
    Type extends string = string,
    Data extends Record<string, unknown> = Record<string, unknown>
    // TODO: maybe result type?
> {
    type: Type
    data: Data
}

export type Jobs<M extends WorkerMessage> = {
    [message in M as message['type']]: (data: message['data']) => Promise<void>
}

export class InvalidMessage extends Error {}
