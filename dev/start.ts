import { Request, Response } from '@google-cloud/functions-framework'
import { http } from '@/http/http'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { getenv } from '@/lib/config/getenv'
import { PubSub } from '@google-cloud/pubsub'
import { config } from '@/config/config'
import { slowQueueHandler } from '@/slow-queue/handler'
import { EventEmitter } from 'events'
import { slowQueue } from '@/slow-queue/queue'
import { pubsub } from '@/lib/google-cloud/pubsub'
import { setImmediate } from 'timers/promises'

const fakePubsub = new EventEmitter()

fakePubsub.on('message', async (message) => {
    await setImmediate()
    await slowQueueHandler({
        data: {
            message: {
                data: message.data.toString('base64'),
            },
        },
    } as unknown as never)
})

const main = async () => {
    if (getenv('USE_FAKE_HTTP', 'false') === 'true') {
        const fn: typeof http.get = async (url) => {
            const fileName = url.split('/').pop() as string
            return readFileSync(resolve(__dirname, './fake-http', fileName), 'utf8')
        }
        Object.assign(http, {
            get: fn,
        })
    }
    const fn: typeof pubsub.publishToSlowQueue = async (message) => {
        fakePubsub.emit('message', message)
        return ''
    }
    Object.assign(pubsub, {
        publishToSlowQueue: fn,
    })
    await slowQueue.publish({ type: 'BlueTrailDataLoadRequest', data: {} })
    console.info('🌈 Development worker started')
}

// const main = async () => {
//     const job = { type: BLUE_TRAIL_DATA_LOAD_REQUEST }
//     const request = {
//         body: {
//             message: {
//                 data: Buffer.from(JSON.stringify(job)).toString('base64'),
//             },
//         },
//     }
//     const response = {
//         statusCode: null as number | null,
//         sent: false,
//         status(code: number) {
//             this.statusCode = code
//         },
//         send() {
//             this.sent = true
//         },
//     }
//     await handler(request as unknown as Request, response as unknown as Response)
//     if (response.statusCode !== 200 || !response.sent) {
//         throw new Error('Response must be sent with status code 200')
//     }
// }

void main()
