import { CloudEventFunction } from '@google-cloud/functions-framework'
import jsonParse from 'secure-json-parse'
import { get, merge } from 'lodash'
import { jobs, SlowQueueMessage } from '@/slow-queue/jobs'
import { Jobs, WorkerMessage } from '@/queue/queue'

export const slowQueueHandler: CloudEventFunction<{
    message: { data: string }
}> = async (event) => {
    const data = get(event, 'data.message.data') as string | undefined
    if (!data) {
        throw new Error(`Invalid event: ${JSON.stringify(event)}`)
    }
    const parsedEvent = merge({}, event, {
        data: {
            message: {
                data: jsonParse(Buffer.from(data, 'base64').toString('utf-8')),
            },
        },
    })
    console.info(JSON.stringify(parsedEvent))
    const messageData = parsedEvent.data.message.data as { job: SlowQueueMessage }
    const job = jobs[messageData.job.type]
    await job(messageData.job.data as unknown as never)
}
