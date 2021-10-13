import { useContext } from "react";
import { DittoContext } from "../lib/context";
import { isDefaultFormatProject, nullError } from "../lib/utils";

interface useDittoSingleTextProps {
  projectId?: string;
  textId: string;
}

export const useDittoSingleText = (props: useDittoSingleTextProps) => {
  const { projectId, textId } = props;
  const { sourceBase, sourceVariant, variant, options } =
    useContext(DittoContext);

  if (!projectId) return nullError("No Project ID provided.");

  if (variant) {
    const project = sourceVariant?.projects[projectId];
    if (project) {
      // structured or flat format
      if (textId in project) {
        return typeof project[textId] === "object" && "text" in project[textId]
          ? project[textId].text
          : project[textId];
      }

      // default format
      if (isDefaultFormatProject(project)) {
        for (const frameId in project.frames) {
          const frame = project.frames[frameId];

          for (const blockId in frame.blocks) {
            const block = frame.blocks[blockId];

            if (textId in block) return block[textId].text;
          }

          if (frame.otherText && textId in frame.otherText)
            return frame.otherText[textId].text;
        }
      }
    }

    if (options?.environment !== "production") {
      const message = `Text not found for textId: "${textId}"`;
      console.error(message);
      return message;
    }
  }

  const project = sourceBase.projects[projectId];
  if (!project) {
    return nullError(`Project not found with id "${projectId}"`);
  }

  // structured or flat format
  if (textId in project)
    return typeof project[textId] === "object" && "text" in project[textId]
      ? project[textId].text
      : project[textId];

  if (!isDefaultFormatProject(project)) {
    return nullError(
      `Default format must be used if passing "frameId" or "blockId"`
    );
  }

  for (const frameId in project.frames) {
    const frame = project.frames[frameId];

    for (const blockId in frame.blocks) {
      const block = frame.blocks[blockId];

      if (textId in block) return block[textId].text;
    }

    if (frame.otherText && textId in frame.otherText)
      return frame.otherText[textId].text;
  }

  return `Text not found for id "${textId}"`;
};
