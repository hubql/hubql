type Hub = {
  name: string
  type: 'api' | 'cli' | 'docs' | 'web'
  openapi?: string
  prefix?: string
  content?: {
    base: string
  }
}

export interface Editor {
  type: 'cursor' | 'vscode'
}

export interface GridConfig {
  rules: {
    input: string
    output: string
  }[]
}

export interface Workspace {
  id: string
  name: string
  base: string
  hubs: Hub[]
  grid: GridConfig
}

export interface HubqlConfig {
  version: string
  workspaces: Workspace[]
  // componentsDir?: string; // Directory for custom components
  // contentDir?: string;    // Directory for MDX content
  // theme?: string;         // Optional Tailwind theme override
}
