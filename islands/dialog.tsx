import { useEffect, useRef } from "preact/hooks";

export interface DialogProps {
  open: boolean;
  content?: string;
  buttons?: Record<string, string>;
  showInput?: boolean;
  onAction?: (action: string, input: string) => void;
}

export default function Dialog(props: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const input_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (props.open) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [props.open]);

  return (
    <dialog ref={ref} className="dialog">
      <span className="dialog-content">{props.content}</span>
      {props.showInput
        ? (
          <div className="dialog-input">
            <input ref={input_ref} type="text" />
          </div>
        )
        : null}
      <div className="dialog-buttons">
        {Object.entries(props.buttons ?? {}).map(([id, text]) => (
          <button
            className="dialog-button"
            onClick={() => {
              console.log("rpops", props);
              props.onAction?.(id, input_ref.current?.value ?? "");
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </dialog>
  );
}
