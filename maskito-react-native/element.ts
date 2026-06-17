import {MaskitoElement} from "@maskito/core";

const noop = () => {};

export function createHeadlessElement({
  value = "",
  maxLength = -1,
}: Partial<MaskitoElement> = {}): MaskitoElement {
  const textfieldLike: Omit<MaskitoElement, keyof HTMLElement> = {
    maxLength,
    value,
    selectionStart: 0,
    selectionEnd: 0,
    setSelectionRange(from: number, to: number): void {
      this.selectionStart = from;
      this.selectionEnd = to;
    },
    select(): void {
      this.setSelectionRange(0, this.value.length);
    },
  };

  const minimumDOMmocks: Pick<
    MaskitoElement,
    | "nodeName"
    | "isContentEditable"
    | "addEventListener"
    | "removeEventListener"
    | "matches"
  > = {
    nodeName: "INPUT",
    isContentEditable: false,
    addEventListener: noop,
    removeEventListener: noop,
    matches: (): this is unknown => true,
  };

  return { ...textfieldLike, ...minimumDOMmocks } as MaskitoElement;
}
