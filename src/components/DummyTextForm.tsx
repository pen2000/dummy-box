import { Form, ActionPanel, Action, showToast, Toast, Clipboard, useNavigation, showHUD, PopToRootType } from "@raycast/api";
import { DummyTextType, DUMMY_TEXTS } from "../constants";
import { useState } from "react";

interface DummyTextFormProps {
  selectedType: DummyTextType;
}

export function DummyTextForm({ selectedType }: DummyTextFormProps) {
  const [length, setLength] = useState<number>(0);
  const [previewText, setPreviewText] = useState<string>("");
  const PREVIEW_MAX_LENGTH = 1000;
  const MAX_LENGTH = 1000000;

  const generateDummyText = (length: number) => {
    if (isNaN(length) || length <= 0) return "";
    return DUMMY_TEXTS[selectedType]
      .repeat(Math.ceil(length / DUMMY_TEXTS[selectedType].length))
      .substring(0, length);
  };

  const handleSubmit = async (values: { length: string }) => {
    const inputLength = parseInt(values.length);
    if (isNaN(inputLength) || inputLength <= 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter a valid number",
      });
      return;
    }

    if (inputLength > MAX_LENGTH) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: `Maximum length is ${MAX_LENGTH} characters`,
      });
      return;
    }

    const dummyText = generateDummyText(inputLength);
    await Clipboard.copy(dummyText);
    await showHUD("Copied!", { clearRootSearch: true, popToRootType: PopToRootType.Immediate });
  };

  const handleLengthChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) {
      setLength(0);
      setPreviewText("");
      return;
    }

    const safeLength = Math.min(numValue, MAX_LENGTH);
    setLength(safeLength);
    const previewLength = Math.min(safeLength, PREVIEW_MAX_LENGTH);
    setPreviewText(generateDummyText(previewLength));
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField 
        id="length" 
        title="Length" 
        placeholder={`Max length: ${MAX_LENGTH}`}
        onChange={handleLengthChange}
      />
      <Form.Description 
        title="Preview"
        text={previewText ? `${previewText}${length > PREVIEW_MAX_LENGTH ? "\n\n(Preview is limited to 1000 characters)" : ""}` : ""} 
      />
    </Form>
  );
}
