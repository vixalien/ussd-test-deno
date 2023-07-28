export interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  return (
    <button class="key-button" onClick={props.onClick}>
      {props.text}
    </button>
  );
}
