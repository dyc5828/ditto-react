import { createContext } from "react";

export interface Block {
  text: string;
}
export interface Frame {
  frameName: string;
  blocks: Block[];
  otherText?: Block[];
}

export interface FormatDefaultProject {
  [frameId: string]: Frame;
}

interface FormatStructured {
  [id: string]: {
    text: string;
  };
}

interface FormatDefaultComponentLibrary {
  [componentApiId: string]: {
    name: string;
    text: string;
  };
}

interface FormatStructuredProject {
  [apiId: string]: {
    text: string;
    tags?: string[];
    notes?: string;
  };
}

interface FormatStructuredCL {
  [apiId: string]: {
    name: string;
    text: string;
  };
}

interface FormatFlat {
  [apiId: string]: string;
}

export type ProjectFormat =
  | FormatDefaultProject
  | FormatFlat
  | FormatStructuredProject;

export type ComponentLibraryFormat =
  | FormatDefaultComponentLibrary
  | FormatFlat
  | FormatStructuredCL;

export type Project = ProjectFormat | ComponentLibraryFormat;

export interface Source {
  projects: {
    [projectId: string]: Project;
  };
  exported_at: string;
}

export interface SourceVariants {
  [variantApiId: string]: Source;
}

type SourceType =
  | FormatDefaultProject
  // This type matches for:
  // - `default` and `structured` formats for the component library
  // - `structured` format for projects
  | FormatStructured
  // This type matches for both projects and the component library
  | FormatFlat
  | { [key: string]: any };

export type DittoSource = {
  [projectId: string]: {
    [variantApiId: string]: SourceType;
  };
};

export const SourceDetector = {
  isFrame: function (source: SourceType): source is FormatDefaultProject {
    if (!source) {
      return false;
    }

    const value = source[Object.keys(source)[0]];
    return value !== null && typeof value === "object" && "frameName" in value;
  },
  isFlat: function (source: SourceType): source is FormatFlat {
    if (!source) {
      return false;
    }

    const value = source[Object.keys(source)[0]];
    return typeof value === "string";
  },
  isStructured: function (source: SourceType): source is FormatStructured {
    if (!source) {
      return false;
    }

    const value = source[Object.keys(source)[0]];
    return value !== null && typeof value === "object" && !this.isFrame(source);
  },
};

export interface DittoOptions {
  environment?: "development" | "staging" | "production";
}

interface DittoContext {
  projectId?: string;
  variant?: string;
  source: DittoSource;
  options?: DittoOptions;
}

export const DittoContext = createContext({} as DittoContext);
