import {
    Delta,
    Path,
    TrailData,
    Point,
    LatLon,
    LocationOnPath,
    CheckPoint,
    Measured,
    MeasuredLocationOnPath,
    CheckPointOnPath,
    PathNode,
    TrailWithNodes,
} from '@/core/types/types'
import { strict as assert } from 'assert'
import { getPreciseDistance } from 'geolib'

export const getDistance = (point1: LatLon, point2: LatLon) =>
    getPreciseDistance(
        { longitude: point1.lon, latitude: point1.lat },
        { longitude: point2.lon, latitude: point2.lat },
        0.001
    )

export const getDelta = (point1: Point, point2: Point): Delta => {
    const diff = point2.elevation - point1.elevation
    const distance = getDistance(point1, point2)
    return {
        distance,
        rise: Math.max(diff, 0),
        descent: Math.abs(Math.min(diff, 0)),
    }
}

export const generateTrailWithNodes = (trail: TrailData): TrailWithNodes => {
    return {
        locations: trail.locations,
        nodes: trail.points.map((point, idx) => ({
            point,
            delta:
                idx === 0
                    ? { distance: 0, descent: 0, rise: 0 }
                    : getDelta(trail.points[idx - 1] as Point, point),
        })),
    }
}

export const generatePath = (trail: TrailWithNodes): Path => {
    assert(trail.locations.length > 0)
    const locations = trail.locations
        .map((location) => {
            let minDistance = Infinity
            let nearestIdx = -1
            trail.nodes.forEach((node, idx) => {
                const distance = getDistance(node.point, location.position)
                if (distance < minDistance) {
                    minDistance = distance
                    nearestIdx = idx
                }
            })
            return {
                ...location,
                nodeIdx: nearestIdx,
            }
        })
        .sort((location1, location2) => location1.nodeIdx - location2.nodeIdx)
    const measuredLocations: MeasuredLocationOnPath[] = locations.map((location, idx) => ({
        ...location,
        distance:
            idx === 0
                ? 0
                : trail.nodes
                      .slice(
                          (locations[idx - 1] as LocationOnPath).nodeIdx + 1,
                          location.nodeIdx + 1
                      )
                      .map((node) => node.delta.distance)
                      .reduce((prev, curr) => prev + curr, 0),
    }))
    const checkpoints: CheckPoint[] = [
        {
            locations: [measuredLocations[0] as MeasuredLocationOnPath],
            name: (measuredLocations[0] as MeasuredLocationOnPath).name,
        },
    ]
    for (let i = 1; i < measuredLocations.length; ++i) {
        const current = measuredLocations[i] as MeasuredLocationOnPath
        const lastCheckpoint = checkpoints[checkpoints.length - 1] as CheckPoint
        const last = lastCheckpoint.locations[
            lastCheckpoint.locations.length - 1
        ] as MeasuredLocationOnPath
        if (current.distance > 1500 || current.name !== last.name) {
            checkpoints.push({
                locations: [current],
                name: current.name,
            })
        } else {
            lastCheckpoint.locations.push(current)
        }
    }
    const checkpointOnPaths: CheckPointOnPath[] = checkpoints.map((checkpoint) => ({
        ...checkpoint,
        nodeIdx: (
            checkpoint.locations[
                Math.floor(checkpoint.locations.length / 2)
            ] as MeasuredLocationOnPath
        ).nodeIdx,
    }))
    return {
        nodes: trail.nodes,
        checkpoints: checkpointOnPaths,
    }
}
