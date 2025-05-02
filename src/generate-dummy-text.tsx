import { List, ActionPanel, Action, useNavigation } from "@raycast/api";
import { DummyTextForm } from "./components/DummyTextForm";
import { DUMMY_TEXTS, DummyTextType } from "./constants";

export default function Command() {
  const { push } = useNavigation();

  return (
    <List isShowingDetail>
      {(Object.keys(DUMMY_TEXTS) as DummyTextType[]).map((type) => (
        <List.Item
          key={type}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
          detail={<List.Item.Detail markdown={DUMMY_TEXTS[type]} />}
          actions={
            <ActionPanel>
              <Action
                title="Generate with specified length"
                onAction={() => push(<DummyTextForm selectedType={type} />)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
