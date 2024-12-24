type Hub = {
  title: string
  openapi: string
  prefix?: string
  content?: {
    dir: string
  }
}
export interface HubqlConfig {
  title?: string // Title of the documentation
  hubs: Hub[]
  // componentsDir?: string; // Directory for custom components
  // contentDir?: string;    // Directory for MDX content
  // theme?: string;         // Optional Tailwind theme override
}
