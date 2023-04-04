import { blueTrailKeys, blueTrailSetup } from '@/hbt/blue-trail-setup'
import format from 'date-fns/format'
import { uniqueId } from '@/id/id'
import { http } from '@/http/http'
import { pointsFromGpx, locationsFromGpx } from '@/xml/xml'
import { config } from '@/config/config'
import { generatePath } from '@/map/map'
import { findByPattern, getLinkUrlsFromHtml } from '@/html/html'
import { storage } from '@/lib/storage/storage'
import { Trail } from '@/core/types/types'
import { slowQueue } from '@/slow-queue/queue'

export const processLoadRequest = async () => {
    const loadRequestId = uniqueId()
    console.log(loadRequestId)
    for (const key of blueTrailKeys) {
        await slowQueue.publish({
            type: 'LoadHikingTrailRequest',
            data: {
                loadId: loadRequestId,
                key,
            },
        })
    }
}
