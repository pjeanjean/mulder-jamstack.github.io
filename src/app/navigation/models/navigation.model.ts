export interface MulderRouteData {
    title?: string;
    activeTopNav?: string;
}

export interface DynamicRoute {
    path: string;
    menupath: string;
    title?: string;
    subTitle?: string;
    meta?: string[];
    mdsource?: string;
    type?: string;
    tocrootselector?: string;
    tocselector?: string[];
    toctitle?: string;
    orderpath?: number;
    level1icon?: string[];
}
