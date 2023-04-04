import { LoadHikingTrailRequestMessage, SlowQueueMessage } from '@/slow-queue/jobs'
import { pubsub } from '@/lib/google-cloud/pubsub'

export const slowQueue = {
    publish: async (message: SlowQueueMessage) => {
        await pubsub.publishToSlowQueue({
            data: Buffer.from(JSON.stringify({ job: message })),
        })
    },
}
