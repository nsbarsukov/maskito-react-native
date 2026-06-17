import {MaskitoElement} from "@maskito/core";

class TextfieldLikeHeadless implements Omit<MaskitoElement, keyof HTMLElement> {
  public readonly maxLength = -1;

  public value = "";
  public selectionStart = 0;
  public selectionEnd = 0;

  public setSelectionRange(from: number, to: number): void {
    this.selectionStart = from;
    this.selectionEnd = to;
  }

  public select(): void {
    this.setSelectionRange(0, this.value.length);
  }
}

export class MaskitoElementHeadless
  extends TextfieldLikeHeadless
  implements
    Pick<
      MaskitoElement,
      | "nodeName"
      | "isContentEditable"
      | "addEventListener"
      | "removeEventListener"
      | "matches"
    >
{
  public readonly nodeName = "INPUT";
  public readonly isContentEditable = false;

  public addEventListener(): void {}
  public removeEventListener(): void {}

  public matches(): this is unknown {
    return true;
  }
}
