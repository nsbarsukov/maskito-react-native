import {Maskito, MaskitoOptions, maskitoTransform} from "@maskito/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import type {
  TextInputChangeEvent,
  TextInputProps,
  ReactNativeElement,
} from "react-native";
import {createHeadlessElement} from "./element";

const NOOP_EVENT = { preventDefault: () => {} } as unknown as any;

/**
 * ```jsx
 * const dateMask = useMaskito(...);
 * <TextInput {...dateMask} placeholder="dd/mm/yyy" />
 * ```
 */
export function useMaskito({
  options,
  defaultValue = "",
  maxLength,
  onChangeText,
  onChange: userOnChange,
}: Pick<
  TextInputProps,
  "onChange" | "onChangeText" | "defaultValue" | "maxLength"
> & {
  readonly options: MaskitoOptions;
}): Pick<TextInputProps, "onChange" | "value" | "selection"> {
  const [selection, setSelection] = useState<TextInputProps["selection"]>();
  const [value, setValue] = useState(() =>
    maskitoTransform(defaultValue, options),
  );

  const mask = useMemo(
    () => new Maskito(createHeadlessElement({ value, maxLength }), options),
    [options],
  );

  const onChange = useCallback(
    (e: TextInputChangeEvent) => {
      const { selectionStart, selectionEnd, data } = reconstructEdit(value, {
        value: e.nativeEvent.text,
        selection: getSelection(e),
      });

      mask["element"].value = value;
      mask["element"].selectionStart = selectionStart;
      mask["element"].selectionEnd = selectionEnd;
      mask["upcomingElementState"] = null;

      if (data) {
        mask["handleInsert"](
          NOOP_EVENT, // TODO: reorder order of arguments – make `event` OPTIONAL 2nd argument
          data,
        );
      } else {
        mask["handleDelete"]({
          event: NOOP_EVENT, // TODO: make `event` OPTIONAL argument
          isForward: false, // TODO: make `isForward` OPTIONAL argument
          selection: [selectionStart, selectionEnd],
        });
      }

      const next = mask["upcomingElementState"] ??
        // TODO: refactor `Maskito.handleDelete()` to fill `upcomingElementState` with non-null value (equals to previous state) even on presses Backspace/Delete for the fixed value
        // Then drop this fallback
        {
          value: mask["element"].value,
          selection: [
            mask["element"].selectionStart ?? 0,
            mask["element"].selectionEnd ?? 0,
          ],
        };

      if (next.value !== value) {
        setValue(next.value);
      }

      setSelection({ start: next.selection[0], end: next.selection[1] });

      userOnChange?.({
        ...e,
        nativeEvent: {
          ...e.nativeEvent,
          text: next.value,
        },
      });
      onChangeText?.(next.value);
    },
    [mask, value, userOnChange, onChangeText],
  );

  // Release the one-shot controlled selection after it has been applied it, so the
  // TextInput goes back to uncontrolled-selection and the user can move the caret.
  useEffect(() => {
    if (selection) {
      setSelection(undefined);
    }
  }, [selection]);

  return { value, selection, onChange };
}

function reconstructEdit(
  previous: string,
  {
    value,
    selection,
  }: { value: string; selection: Required<TextInputProps>["selection"] },
): { selectionStart: number; selectionEnd: number; data: string } {
  const { start } = selection;
  const minLength = Math.min(previous.length, value.length);

  let prefix = 0;

  while (prefix < minLength && previous[prefix] === value[prefix]) {
    prefix += 1;
  }

  const selectionEnd = Math.max(
    0,
    Math.min(previous.length, previous.length - value.length + start),
  );
  const selectionStart = Math.max(0, Math.min(prefix, start, selectionEnd));

  return {
    selectionStart,
    selectionEnd,
    data: value.slice(selectionStart, start),
  };
}

function getSelection({
  nativeEvent,
  target,
}: TextInputChangeEvent &
  Pick<TextInputProps, "selection">): Required<TextInputProps>["selection"] {
  /**
   * `selection` is part of `TextInput.onChange` event for all platforms since react-native >= 0.85.0
   * This utility is required to typecast poor typings only.
   * https://github.com/react/react-native/commit/162627af7c53e27433f39f82c4630baff0695bf1
   * https://github.com/react/react-native/commit/c1f5445f4a59d0035389725e47da58eb3d2c267c
   *
   * TODO: delete typecast after merging this PR https://github.com/react/react-native/pull/57249
   */
  const selection =
    "selection" in nativeEvent &&
    (nativeEvent.selection as TextInputProps["selection"]);

  const fallback: Required<TextInputProps>["selection"] = isWeb(target)
    ? { start: target.selectionStart ?? 0, end: target.selectionEnd ?? 0 }
    : { start: 0, end: 0 };

  return selection ? selection : fallback;
}

function isWeb(
  element: ReactNativeElement | HTMLInputElement,
): element is HTMLInputElement {
  return "selectionStart" in element;
}
