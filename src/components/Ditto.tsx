import { useContext } from "react";
import { DittoText } from "./DittoText";
import { DittoFrameOrBlock } from "./DittoFrameOrBlock";
import { DittoComponent } from "./DittoComponent";
import { Block, DittoContext, Frame } from "../lib/context";
import {
  isFrameOrBlockComponent,
  isText,
  fragmentError,
  isComponentLibrary,
  isProject,
} from "../lib/utils";

export interface DittoFrameProps {
  projectId?: string;
  frameId: string;
  children: (frame: Frame) => React.ReactNode;
}

export interface DittoBlockProps {
  projectId?: string;
  frameId: string;
  blockId: string;
  children: (block: Block) => React.ReactNode;
}

export interface DittoTextProps {
  projectId?: string;
  textId: string;
  children?: (text: string) => React.ReactNode;
}

export interface DittoComponentLibraryProps {
  componentId: string;
  children?: (text: string) => React.ReactNode;
}

export interface DittoFilters {
  filters?: {
    tags: string[];
  };
}

export type DittoFrameOrBlockProps = DittoFilters &
  (DittoFrameProps | DittoBlockProps);

export type DittoProjectProps = DittoFilters &
  (DittoFrameProps | DittoBlockProps | DittoTextProps);

export type DittoProps = DittoProjectProps | DittoComponentLibraryProps;

export function Ditto(props: DittoProps) {
  const dittoContext = useContext(DittoContext);

  if (isComponentLibrary(props)) {
    return <DittoComponent {...props} />;
  }

  if (isProject(props, dittoContext.projectId)) {
    const projectId = props.projectId || dittoContext.projectId;
    if (!projectId) {
      return fragmentError(
        "No Project ID was provided to the <DittoProvider /> or <Ditto /> components."
      );
    }

    const propsWithProject = { ...props, projectId };

    if (isText(propsWithProject)) {
      return <DittoText {...propsWithProject} />;
    }

    if (isFrameOrBlockComponent(propsWithProject)) {
      return <DittoFrameOrBlock {...propsWithProject} />;
    }
  }

  return fragmentError(
    'Invalid props provided to Ditto component; please provide "componentId", "textId" or "frameId"'
  );
}
