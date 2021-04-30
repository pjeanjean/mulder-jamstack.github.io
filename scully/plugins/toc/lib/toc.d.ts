import { HandledRoute } from '@scullyio/scully';
export declare const headingLevel: (tag: string) => number | null;
export declare const tocPlugin: (html: string, routeData: HandledRoute) => Promise<string>;
