import { useContext } from "react";
import { DittoContext, SourceDetector } from "../lib/context";
import { nullError } from "../lib/utils";

type DittoComponentString = string;
type DittoComponentObject = {
  text: string;
};
type DittoComponent = DittoComponentString | DittoComponentObject;

interface Args {
  componentId: string;
  alwaysReturnString: boolean;
}

export const useDittoComponent = (props: Args): DittoComponent => {
  const { componentId, alwaysReturnString } = props;
  const { source, variant, options } = useContext(DittoContext);

  if (!("ditto_component_library" in source)) {
    throw new Error(
      "An export file for the Component Library couldn't be found."
    );
  }

  if (variant) {
    const data = source?.ditto_component_library?.[variant];

    if (data && data[componentId]) {
      if (SourceDetector.isStructured(data)) {
        return alwaysReturnString ? data[componentId].text : data[componentId];
      } else if (SourceDetector.isFlat(data)) {
        return data[componentId];
      }
    }

    if (options?.environment !== "production") {
      const message = `Text not found for componentId: "${componentId}"`;
      console.error(message);
      return message;
    }
  }

  const data = source?.ditto_component_library?.base;
  if (!data) {
    return nullError("Base text not found in component library");
  }

  const value = data[componentId];
  if (!value) {
    return nullError(`Text not found for component "${componentId}"`);
  }

  if (SourceDetector.isStructured(data)) {
    return alwaysReturnString ? data[componentId].text : data[componentId];
  } else if (SourceDetector.isFlat(data)) {
    return data[componentId];
  } else {
    return nullError(`Invalid format for component ${componentId}`);
  }
};
