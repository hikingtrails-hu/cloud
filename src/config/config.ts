import { getenv } from '@/lib/config/getenv'

export const config = {
    keepEveryNthLocation: Number(getenv('KEEP_EVERY_NTH_LOCATION', '1')),
    keepEveryNthPathNode: Number(getenv('KEEP_EVERY_NTH_PATH_NODE', '1')),
    gCloud: {
        projectName: getenv('GCLOUD_PROJECT', ''),
        storageApiEndpoint: getenv('GCLOUD_STORAGE_API_ENDPOINT', ''),
        storageBucketName: 'hikingtrails-db',
        slowQueueTopic: 'slow-queue',
    },
}
