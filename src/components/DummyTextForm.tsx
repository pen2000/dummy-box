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

  const generateDummyText = (length: number) => {
    if (isNaN(length) || length <= 0) return "";
    return DUMMY_TEXTS[selectedType]
      .repeat(Math.ceil(length / DUMMY_TEXTS[selectedType].length))
      .substring(0, length);
  };

  const handleSubmit = async (values: { length: string }) => {
    const length = parseInt(values.length);
    if (isNaN(length) || length <= 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter a valid number",
      });
      return;
    }

    const dummyText = generateDummyText(length);
    await Clipboard.copy(dummyText);
    await showHUD("Copied!", { clearRootSearch: true, popToRootType: PopToRootType.Immediate });
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
        placeholder="Enter the number of characters to generate"
        onChange={(value) => {
          setLength(parseInt(value));
          const previewLength = Math.min(parseInt(value), PREVIEW_MAX_LENGTH);
          setPreviewText(generateDummyText(previewLength));
        }}
      />
      <Form.Description 
        text={previewText ? `${previewText}${length > PREVIEW_MAX_LENGTH ? "\n\n(Preview is limited to 1000 characters)" : ""}` : "This will generate a random dummy text of the specified length."} 
      />
    </Form>
  );
}
