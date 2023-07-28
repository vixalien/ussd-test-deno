import { Signal } from "@preact/signals";

export interface InputProps {
  label: string;
  signal: Signal;
}

export default function Input(props: InputProps) {
  return (
    <div class="input">
      <label>{props.label}</label>
      <input
        type="text"
        value={props.signal.value}
        onChange={(e) => (props.signal.value = e.currentTarget.value)}
      />
    </div>
  );
}
