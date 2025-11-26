import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";

const fieldNames = {
  status: "status"
}

export const anchorrDefaultFields = [fieldNames.status];

export default function Component({ service }) {
  const { widget } = service;

  widget.fields = widget?.fields?.length ? widget.fields : anchorrDefaultFields;

  const isStatusEnabled  = widget.fields.includes(fieldNames.status);

  const { data: statusData, error: statusError } = useWidgetAPI(widget, isStatusEnabled ? fieldNames.status : "");

  // Error handling
  if (statusError) {
    const error = statusError;

    return <Container service={service} error={error} />;
  }

  // Loading state
  if (isStatusEnabled && !statusData) {
    return (
      <Container service={service}>
        <Block label="anchorr.status" />
      </Container>
    );
  }

  // Render data
  return (
    <Container service={service}>
      <Block label="anchorr.status" value={formatStatusResult(statusData)} />
    </Container>
  );
}

const formatStatusResult = (result) => {
  const status = result?.isBotRunning;

  if (status === true || status === "true") {
    return "Running";
  } else if (status === false || status === "false") {
    return "Stopped";
  }

  return "Unknown";
}
