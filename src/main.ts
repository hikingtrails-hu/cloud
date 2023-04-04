import { http, HttpFunction, cloudEvent } from '@google-cloud/functions-framework'
import jsonParse from 'secure-json-parse'
import { processLoadRequest } from '@/job/load-request'
import { slowQueueHandler } from '@/slow-queue/handler'

export const main = () => {
    cloudEvent('slow-queue-worker', slowQueueHandler)
}
