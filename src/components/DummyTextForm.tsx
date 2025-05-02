import { Form, ActionPanel, Action, showToast, Toast, Clipboard, useNavigation } from "@raycast/api";
import { DummyTextType, DUMMY_TEXTS } from "../constants";

interface DummyTextFormProps {
  selectedType: DummyTextType;
}

export function DummyTextForm({ selectedType }: DummyTextFormProps) {
  const { pop } = useNavigation();

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

    const dummyText = DUMMY_TEXTS[selectedType]
      .repeat(Math.ceil(length / DUMMY_TEXTS[selectedType].length))
      .substring(0, length);

    await Clipboard.copy(dummyText);
    await showToast({
      style: Toast.Style.Success,
      title: "Copied!",
      message: `${length} characters of dummy text copied to clipboard`,
    });
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="length" title="Length" placeholder="Enter the number of characters to generate" />
    </Form>
  );
}
