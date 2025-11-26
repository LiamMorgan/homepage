import Block from "components/services/widget/block";
import Container from "components/services/widget/container";

import useWidgetAPI from "utils/proxy/use-widget-api";

const fieldNames = {
  invites: "invites",
  accepted: "accepted",
  expired: "expired"
};

export const wizarrDefaultFields = [fieldNames.invites, fieldNames.accepted];

export default function Component({ service }) {
  const { widget } = service;

  widget.fields = widget?.fields?.length ? widget.fields : wizarrDefaultFields;

  const isInvitesEnabled  = widget.fields.includes(fieldNames.invites);
  const isAcceptedEnabled = widget.fields.includes(fieldNames.accepted);
  const isExpiredEnabled = widget.fields.includes(fieldNames.expired);

  const { data: invitationsData, error: invitationsError } = useWidgetAPI(widget, isInvitesEnabled || isExpiredEnabled ? fieldNames.invites : "");
  const { data: usersData, error: usersError } = useWidgetAPI(widget, isAcceptedEnabled ? fieldNames.accepted : "");

  // Error handling
  if (invitationsError || usersError) {
    const error = invitationsError || usersError;

    return <Container service={service} error={error} />;
  }

  // Loading state
  if (
    ((isInvitesEnabled || isExpiredEnabled) && !invitationsData) ||
    (isAcceptedEnabled && !usersData)
  ) {
    return (
      <Container service={service}>
        <Block label="wizarr.invites" />
        <Block label="wizarr.accepted" />
        <Block label="wizarr.expired" />
      </Container>
    );
  }

  // Render data
  return (
    <Container service={service}>
      <Block label="wizarr.invites" value={formatInvitesResult(invitationsData)} />
      <Block label="wizarr.accepted" value={formatAcceptedResult(usersData)} />
      <Block label="wizarr.expired" value={formatExpiredResult(invitationsData)} />
    </Container>
  );
}

const formatInvitesResult = (result) => {
  const invitationCount = result?.invitations?.length || 0;
  const expiredInvitationsCount = getExpiredInvitationsCount(result?.invitations);

  return invitationCount - expiredInvitationsCount;
}

const formatAcceptedResult = (result) => {
  // This is janky, but currently checks who accepted invite by if they have an email
  const emptyEmail = "empty";
  const usersWithEmail = result?.users?.filter(user => user.email && user.email.length > 0 && user.email !== emptyEmail);

  return usersWithEmail?.length || 0;
};

const formatExpiredResult = (result) => {
  const expiredInvitationsCount = getExpiredInvitationsCount(result?.invitations);

  return expiredInvitationsCount;
};

const getExpiredInvitationsCount = (invitations) => {
  return invitations?.filter(invite => {
    const expiryDate = new Date(invite.expires);
    const currentDate = new Date();

    return (invite.used_at && !invite.unlimited) || (invite.expires && expiryDate < currentDate);
  })?.length || 0;
}
