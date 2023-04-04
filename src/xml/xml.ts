import { parseString } from 'xml2js'
import { Location, Point } from '@/core/types/types'
import { generateId } from '@/id/id'

export const pointsFromGpx = async (gpx: string): Promise<Point[]> => {
    const data = await parseXml(gpx)
    return data.gpx.trk[0].trkseg[0].trkpt.map((node: any) => ({
        lat: Number(node.$.lat),
        lon: Number(node.$.lon),
        elevation: Number(node.ele ?? 0),
    }))
}

export const locationsFromGpx = async (gpx: string): Promise<Location[]> => {
    const data = await parseXml(gpx)
    return data.gpx.wpt.map((node: any) => ({
        position: {
            lat: Number(node.$.lat),
            lon: Number(node.$.lon),
            elevation: 0,
        },
        description: String(node.desc[0]),
        name: String(node.name[0]),
        id: generateId(),
    }))
}

export const parseXml = async (xml: string): Promise<any> =>
    await new Promise((resolve, reject) =>
        parseString(xml, (err, result) => (err ? reject(err) : resolve(result)))
    )
