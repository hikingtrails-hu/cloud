import { PubSub, Topic } from '@google-cloud/pubsub'
import { config } from '@/config/config'

const publishToSlowQueue: Topic['publishMessage'] = async (message) => {
    return new PubSub({ projectId: config.gCloud.projectName })
        .topic(config.gCloud.slowQueueTopic)
        .publishMessage(message)
}

export const pubsub = {
    publishToSlowQueue,
}
