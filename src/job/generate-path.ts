import { blueTrailKeys, blueTrailSetup } from '@/hbt/blue-trail-setup'
import { generateTrailWithNodes, generatePath } from '@/map/map'
import { storage } from '@/lib/storage/storage'
import { Trail, TrailWithNodes } from '@/core/types/types'
import { SlowQueueMessage } from '@/slow-queue/jobs'

export const processGeneratePathRequest = async (job: SlowQueueMessage['data']) => {
    const { key, loadId } = job
    const trailSetup = blueTrailSetup[key]
    const withNodes = await storage.get<TrailWithNodes>(`load/${loadId}/${key}/trailWithNodes.json`)
    const path = generatePath(withNodes)
    const trail: Trail = {
        path,
        name: trailSetup.name,
        id: key,
    }
    console.log(`Trail '${key}' finished.`)
    await storage.set(`trails/current/${key}.json`, trail)
}
