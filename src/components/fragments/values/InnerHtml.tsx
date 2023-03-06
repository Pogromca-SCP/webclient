import { ValueViewParams } from "../sharedParams";

export interface InnerHtmlParams extends ValueViewParams {
  containerClass: string,
  style: string
}

const InnerHtml = (props: Readonly<InnerHtmlParams>) => {
  return (
    <>
      <style>{props.style}</style>
      <span className={props.containerClass} dangerouslySetInnerHTML={{
        __html: props.value
      }} />
    </>
  );
};

export default InnerHtml;
