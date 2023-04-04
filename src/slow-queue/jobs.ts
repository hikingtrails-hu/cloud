import { Jobs, WorkerMessage } from '@/queue/queue'
import { BlueTrailKey } from '@/hbt/blue-trail-setup'
import { processLoadRequest } from '@/job/load-request'
import { processLoadHikingTrailRequest } from '@/job/load-hiking-trail'
import { processGeneratePathRequest } from '@/job/generate-path'

export type BlueTrailDataLoadRequestMessage = WorkerMessage<
    'BlueTrailDataLoadRequest',
    Record<string, never>
>

export type RequestData = {
    loadId: string
    key: BlueTrailKey
}

export type LoadHikingTrailRequestMessage = WorkerMessage<'LoadHikingTrailRequest', RequestData>

export type GeneratePathRequestMessage = WorkerMessage<'GeneratePathRequest', RequestData>

export type SlowQueueMessage =
    | BlueTrailDataLoadRequestMessage
    | LoadHikingTrailRequestMessage
    | GeneratePathRequestMessage

export const jobs: Jobs<SlowQueueMessage> = {
    LoadHikingTrailRequest: async (data) => {
        await processLoadHikingTrailRequest(data)
    },
    BlueTrailDataLoadRequest: async () => {
        await processLoadRequest()
    },
    GeneratePathRequest: async (data) => {
        await processGeneratePathRequest(data)
    },
}
