import { blueTrailKeys, blueTrailSetup } from '@/hbt/blue-trail-setup'
import format from 'date-fns/format'
import { uniqueId } from '@/id/id'
import { http } from '@/http/http'
import { pointsFromGpx, locationsFromGpx } from '@/xml/xml'
import { config } from '@/config/config'
import { generateTrailWithNodes, generatePath } from '@/map/map'
import { findByPattern, getLinkUrlsFromHtml } from '@/html/html'
import { storage } from '@/lib/storage/storage'
import { Trail, TrailWithNodes } from '@/core/types/types'
import { slowQueue } from '@/slow-queue/queue'
import { RequestData, SlowQueueMessage } from '@/slow-queue/jobs'

export const processLoadHikingTrailRequest = async (job: RequestData) => {
    const { key, loadId } = job
    const trailSetup = blueTrailSetup[key]
    const trailPageBody = await http.get(trailSetup.dataHomepageUrl)
    const links = getLinkUrlsFromHtml(trailPageBody)
    const pathGpxUrl = findByPattern(links, trailSetup.pathGpxUrlPattern)
    const stampGpxUrl = findByPattern(links, trailSetup.stampGpxUrlPattern)
    const [allPoints, allLocations] = await Promise.all([
        http.get(pathGpxUrl).then(pointsFromGpx),
        http.get(stampGpxUrl).then(locationsFromGpx),
    ])
    const points = allPoints.filter((_, idx) => idx % config.keepEveryNthPathNode === 0)
    const locationsData = allLocations.filter((_, idx) => idx % config.keepEveryNthLocation === 0)
    const withNodes = generateTrailWithNodes({
        points,
        locations: locationsData,
    })
    await storage.set<TrailWithNodes>(`load/${loadId}/${key}/trailWithNodes.json`, withNodes)
    await slowQueue.publish({
        type: 'GeneratePathRequest',
        data: job,
    })
}
