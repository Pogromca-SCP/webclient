import { useState, useEffect } from "react";

export interface GeneratorParams<T> {
  selector: string,
  result: ((el: Readonly<T>, index: number) => JSX.Element) | ((el: Readonly<T>) => JSX.Element),
  update?: unknown
}

// Contents generator component capable of generating components for all found elements with ids
const ContentsGenerator = <T extends Element>(props: Readonly<GeneratorParams<T>>) => {
  const [contents, setContents] = useState<T[]>([]);
  useEffect(() => setContents(Array.from(document.querySelectorAll(props.selector))), [props.update, props.selector]);
  return <>{contents.map((el, index) => el.id ? props.result(el, index) : "")}</>;
};

export default ContentsGenerator;
