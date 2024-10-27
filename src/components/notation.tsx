import abcjs, { TuneObject } from "abcjs";
import { createEffect, createMemo, createSignal } from "solid-js";

export default function Notation(props: {
  notation: string;
  options?: abcjs.AbcVisualParams;
}) {
  let container: HTMLDivElement;
  const [tuneObject, setTuneObject] = createSignal<TuneObject | null>(null);
  const warnings = createMemo(() => tuneObject()?.warnings);

  createEffect(() => {
    if (warnings()) console.log(warnings());
  });

  createEffect(() => {
    if (container) {
      console.time("abcRender");
      const [tuneObject] = abcjs.renderAbc(
        container,
        props.notation,
        props.options,
      );
      console.timeEnd("abcRender");
      setTuneObject(tuneObject);
    }
  }, [props.notation, JSON.stringify(props.options)]);

  return (
    <>
      <div ref={container}></div>
      {warnings() && (
        <ul>
          {warnings().map((warning, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: warning }}></li>
          ))}
        </ul>
      )}
    </>
  );
}
