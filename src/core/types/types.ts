export type LatLon = {
    lat: number
    lon: number
}

export type Point = LatLon & {
    elevation: number
}

export type Delta = {
    distance: number
    rise: number
    descent: number
}

export type PathNode = HasDeltaFromPrevious & {
    point: Point
}

export type HasDeltaFromPrevious = {
    delta: Delta
}

export type Path = {
    nodes: PathNode[]
    checkpoints: CheckPointOnPath[]
}

export type TrailWithNodes = {
    nodes: PathNode[]
    locations: Location[]
}

export type Location = {
    name: string
    description: string
    position: Point
    id: string
}

export type LocationOnPath = Location & OnPath

export type TrailData = {
    points: Point[]
    locations: Location[]
}

export type OnPath = {
    nodeIdx: number
}

export type CheckPoint = {
    name: string
    locations: MeasuredLocationOnPath[]
}

export type CheckPointOnPath = OnPath & CheckPoint

export type Measured = {
    distance: number
}

export type MeasuredLocationOnPath = Measured & LocationOnPath

export type Trail = {
    path: Path
    name: string
    id: string
}
